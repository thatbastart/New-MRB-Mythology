# Building and running the backend

```
cargo run -- --db db.sqlite --port 8000
```

# API

## `/get_notes`

```
$ curl http://[::1]:8000/api/get_notes
[{"title":"Ja genau","content":"lol","lat":42.6437680532846,"lon":-90.47605216408084}]
```

## `/add_note`

```
$ curl http://[::1]:8000/api/add_note --data '{ "content": "foo", "title": "bar", "lat": 43.1, "lon": -91.17 }'
"ok"

# lon fehlt
$ curl http://[::1]:8000/api/add_note --data '{ "content": "foo", "title": "bar", "lat": 43.1 }'

            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <title>422 Unprocessable Entity</title>
            </head>
            <body align="center">
                <div role="main" align="center">
                    <h1>422: Unprocessable Entity</h1>
                    <p>The request was well-formed but was unable to be followed due to semantic errors.</p>
                    <hr />
                </div>
                <div role="contentinfo" align="center">
                    <small>Rocket</small>
                </div>
            </body>
            </html>

```
