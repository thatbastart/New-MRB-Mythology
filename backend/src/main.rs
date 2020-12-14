#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;

use docopt::Docopt;
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

#[derive(Serialize, Deserialize, Debug)]
struct Note {
    title: String,
    content: String,
    lat: f64,
    lon: f64,
    kind: String,
}

type ApiResult = Result<JsonValue, JsonValue>;

#[post("/", data = "<msg>")]
fn add_note(db: State<'_, DbConnection>, msg: Json<Note>) -> ApiResult {
    let Note {
        content,
        title,
        lat,
        lon,
        kind,
    } = msg.into_inner();
    let db_conn = db.lock().expect("db connection lock");
    let insert_op = db_conn.execute(
        "INSERT INTO notes (title, content, lat, lon, kind) VALUES ($1, $2, $3, $4, $5)",
        params![title, content, lat, lon, kind],
    );
    match insert_op {
        Ok(_) => ApiResult::Ok(json!("ok")),
        Err(e) => ApiResult::Err(json!(format!(
            "Shit. Es ist was schiefgegangen. Sags Kerstin! :: {}",
            e
        ))),
    }
}

#[get("/")]
fn get_notes(db: State<'_, DbConnection>) -> Json<Vec<Note>> {
    let db_conn = db.lock().expect("db connection lock");
    let mut query = db_conn
        .prepare("SELECT title, content, lat, lon, kind FROM notes")
        .unwrap();
    let notes: Vec<Note> = query
        .query_map(params![], |row| {
            Ok(Note {
                title: row.get(0)?,
                content: row.get(1)?,
                lat: row.get(2)?,
                lon: row.get(3)?,
                kind: row.get(4)?,
            })
        })
        .unwrap()
        .into_iter()
        .filter_map(|r| r.ok())
        .collect();
    Json(notes)
}

#[launch]
fn rocket() -> Rocket {
    let args: CliArgs = Docopt::new(USAGE)
        .and_then(|d| d.deserialize())
        .unwrap_or_else(|e| e.exit());

    let db = Connection::open(args.flag_db).unwrap();
    db.execute(
        "CREATE TABLE IF NOT EXISTS notes 
          (createtime DATETIME
          , title TEXT NOT NULL
          , content TEXT
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
}
