# Development server

```
$ lighttpd -D -f lighttpd.conf
```

```
$ darkhttpd . --port 8001
```

```
$ cd backend

$ cargo run -- --port 8000 --db db.sqlite
```
