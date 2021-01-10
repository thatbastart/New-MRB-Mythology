#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;
#[macro_use]
extern crate log;

use docopt::Docopt;
use kdtree::distance::squared_euclidean;
use kdtree::KdTree;
use rocket::Data;
use rocket::{Rocket, State};
use rocket_contrib::json::{Json, JsonValue};
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::net::{IpAddr, Ipv6Addr};
use std::path::PathBuf;
use std::sync::Mutex;

const USAGE: &'static str = "
Usage: mrb-mythology-backend --db <db> --port <port>
       mrb-mythology-backend --help

Options:
    -h, --help           Show this message.
    --db <db>            Path to sqlite database.
    --port <port>        TCP port on which the server listens.
";

#[derive(Deserialize)]
struct CliArgs {
    flag_db: PathBuf,
    flag_port: u16,
}

type DbConnection = Mutex<Connection>;

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
struct NoteContent {
    title: String,
    text: String,
    creation_date: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Note {
    lat: f64,
    lon: f64,
    kind: String,
    versions: Vec<NoteContent>,
}

type ApiResult = Result<JsonValue, JsonValue>;

/// Add a new note, or a revision of an existing note.
#[post("/", data = "<msg>")]
fn add_note(db: State<'_, DbConnection>, msg: Json<Note>) -> ApiResult {
    let Note {
        versions,
        lat,
        lon,
        kind,
    } = msg.into_inner();

    if versions.len() != 1 {
        return ApiResult::Err(json!(
            "Error: versions array muss genau ein Element enthalten."
        ));
    }

    let NoteContent { title, text, .. } = versions.get(0).unwrap();

    let db_conn = db.lock().expect("db connection lock");
    let insert_op = db_conn.execute(
        "INSERT INTO notes (creation_date, title, content, lat, lon, kind)
            VALUES (STRFTIME('%Y-%m-%d %H:%M', 'NOW'), $1, $2, $3, $4, $5)",
        params![title, text, lat, lon, kind],
    );

    match insert_op {
        Ok(_) => ApiResult::Ok(json!("ok")),
        Err(e) => ApiResult::Err(json!(format!(
            "Shit. Es ist was schiefgegangen. Sags Kerstin! :: {}",
            e
        ))),
    }
}

/// Get all notes in the database.
#[get("/")]
fn get_notes(db: State<'_, DbConnection>) -> Json<Vec<Note>> {
    let db_conn = db.lock().expect("db connection lock");
    let mut query = db_conn
        .prepare("SELECT creation_date, title, content, lat, lon, kind FROM notes")
        .unwrap();

    // Coordinates are our primary key here. But Rust doesn't have Eq for f64 (for good reasons),
    // so we have to use some heuristic to determine wether two coordinate pairs are equal.
    // KdTrees are an representation for point clouds with great efficience regarding the question
    // "Which points are not father than 0.01 from this point?".
    let mut notes_locations: KdTree<f64, (String, NoteContent, usize), _> = KdTree::new(2);

    // We need this extra data structure, as apparently kdtree doesn't allow for retrieval of the
    // point coordinates...
    let mut notes_coordinates: Vec<(f64, f64)> = Vec::new();

    // And this one so we don't use the same NoteContent twice.
    let mut notes_already_in_result: Vec<bool> = Vec::new();

    // Get all rows and populate the data structures from it.
    {
        let mut current_id: usize = 0;
        query
            .query_map(params![], |row| {
                let (lat, lon) = (row.get(3)?, row.get(4)?);
                let kind: String = row.get(5)?;
                notes_locations
                    .add(
                        [lat, lon],
                        (
                            kind,
                            NoteContent {
                                title: row.get(1)?,
                                text: row.get(2)?,
                                creation_date: row.get(0)?,
                            },
                            current_id,
                        ),
                    )
                    .unwrap();
                notes_coordinates.push((lat, lon));
                notes_already_in_result.push(false);
                current_id += 1;
                Ok(())
            })
            .unwrap()
            .count();
    }

    let mut notes: Vec<Note> = Vec::new();

    debug!("KdTree contents: {:?}", notes_locations);

    // Iterate over KdTree and build clusters of points, that are not father away from each other
    // than a certain distance.
    const EPSILON_DISTANCE: f64 = 0.001;
    for (_, (kind, _, id)) in notes_locations
        .nearest(&[0.0, 0.0], usize::MAX, &squared_euclidean)
        .unwrap()
    {
        debug!("{{ kind: {}, id: {} }}", kind, id);

        if *notes_already_in_result.get(*id).unwrap() {
            debug!("Skip id {}.", id);
            continue;
        }
        debug!("Do not skip id {}.", id);

        let (lat, lon) = notes_coordinates.get(*id).unwrap();

        let versions: Vec<NoteContent> = {
            let mut versions = Vec::new();
            for (_, (_, note_content, id)) in notes_locations
                .within(&[*lat, *lon], EPSILON_DISTANCE, &squared_euclidean)
                .unwrap()
            {
                debug!("{{ note_content: {:?}, id: {} }}", note_content, id);
                versions.push(note_content.clone());
                *notes_already_in_result.get_mut(*id).unwrap() = true;
            }
            versions.sort_by(|a, b| {
                a.creation_date
                    .as_ref()
                    .unwrap()
                    .cmp(&b.creation_date.as_ref().unwrap())
            });
            versions
        };

        notes.push(Note {
            lat: *lat,
            lon: *lon,
            kind: kind.to_string(),
            versions,
        });
    }

    Json(notes)
}

/// Upload an image file.
#[post("/", data = "<data>")]
async fn upload_image(_state: State<'_, DbConnection>, data: Data) -> ApiResult {
    use data_url::DataUrl;
    use image::io::Reader;
    use image::ImageFormat;
    use rocket::data::ToByteUnit;
    use std::io::Cursor;

    let url_str = {
        if let Ok(url_str) = data.open(50_i32.mebibytes()).stream_to_string().await {
            url_str
        } else {
            return ApiResult::Err(json!("Wrong encoding."));
        }
    };

    // This is a nasty hack. Apparently Rocket secures a DataStream that we can only get a limited
    // amount of bytes from it, but there seems to be no way to handle the case if the stream is
    // longer than the limit. As in that case the resulting image will be invalid, we have to test
    // this and send an error.
    if url_str.len() >= 1024 * 1024 * 50 {
        return ApiResult::Err(json!("Image can't be larger than 50MB."));
    }

    let data_url = DataUrl::process(&url_str).unwrap();
    let (data_body, _) = data_url.decode_to_vec().unwrap();
    let mime_type = format!("{}", data_url.mime_type());

    println!("Image mime type: {}", mime_type);

    let image_reader = Reader::new(Cursor::new(&data_body))
        .with_guessed_format()
        .expect("This doesn't fail");

    match (image_reader.format(), mime_type.as_str()) {
        (None, _) => ApiResult::Err(json!("Couldn't determine image format from raw data.")),
        (Some(ImageFormat::Jpeg), "image/jpeg") => write_image(data_body, "jpeg"),
        (Some(ImageFormat::Png), "image/png") => write_image(data_body, "png"),
        _ => ApiResult::Err(json!(format!(
            "Image format and MIME type {} does not match.",
            mime_type
        ))),
    }
}

fn write_image(data: Vec<u8>, file_extension: &str) -> ApiResult {
    use sha2::{Digest, Sha256};
    use std::fs;

    let hash_str = {
        let mut hasher = Sha256::new();
        hasher.update(&data);
        let hash = hasher.finalize();
        format!("{:x}", hash)
    };

    let path = format!("/images/{}.{}", hash_str, file_extension);

    if let Ok(()) = fs::write(format!("/var/lib/mrb-mythology-backend/images{}", &path), &data) {
        ApiResult::Ok(json!({ "file_path": path }))
    } else {
        ApiResult::Err(json!("Failed to create file."))
    }
}

#[launch]
fn rocket() -> Rocket {
    let args: CliArgs = Docopt::new(USAGE)
        .and_then(|d| d.deserialize())
        .unwrap_or_else(|e| e.exit());

    let db = Connection::open(args.flag_db).unwrap();
    db.execute(
        "CREATE TABLE IF NOT EXISTS notes 
          (creation_date DATETIME NOT NULL
          , title TEXT NOT NULL
          , content TEXT NOT NULL
          , lat REAL NOT NULL
          , lon REAL NOT NULL
          , kind TEXT NOT NULL)",
        params![],
    )
    .unwrap();
    let rocket_config = rocket::Config::figment()
        .merge(("port", args.flag_port))
        .merge(("address", IpAddr::V6(Ipv6Addr::new(0, 0, 0, 0, 0, 0, 0, 1))));
    //.merge(("tls", None));
    rocket::custom(rocket_config)
        .manage(Mutex::new(db))
        .mount("/api/add_note", routes![add_note])
        .mount("/api/get_notes", routes![get_notes])
        .mount("/api/upload_image", routes![upload_image])
}
