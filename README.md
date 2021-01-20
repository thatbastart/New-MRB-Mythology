Find the live version at [https://mississippi.erictapen.name/](https://mississippi.erictapen.name/).

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

## Backend

Test image upload:

```
echo "data:image/jpeg;base64,$(cat test.jpeg | base64 -w0)" | curl --data @- http://127.0.0.1:8080/api/upload_image
```
