# PNG Stamper

Stamp your png's with metadata using `tEXt` chunks.

send a POST request like this:

```json
POST /stamp
{
    "file": <base64 encoded png>,
    "stamp": {
        "Software" : "Nightingale",
        "Author" : "Kanye West"
    }
}
```

and you'll get back an image with the metadata.
