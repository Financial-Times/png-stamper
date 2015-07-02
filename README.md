![A stamp with the face of the queen on it](http://i.imgur.com/6CmgCQM.png)
# PNG Stamper

Stamp your png's with metadata using `tEXt` chunks. only works with node.js v0.10, as there is currently an error with Buffers in v0.11+.

## Stamping images
send a POST request like this:

```json
POST /stamp
Content-Type: "application/json"
{
    "file": "<base64 encoded png>",
    "stamp": {
        "Software" : "Nightingale",
        "Author" : "Kanye West"
    }
}
```

and you'll get back an image with the metadata.


## Reading images
POST an png image and you will get back a list of chunk metadata it contains.

*you must set Content-Type to image/png*

```
POST /read
Content-Type: "image/png"
<png binary>
```



## Checking if a PNG contains a key/value
POST a png image to `/contains/:key/:value` and you will get back the object (i.e. the key-value pair) or an error

```
POST /conatins/Software/Nightingale
Content-Type: "image/png"
<png binary>
```

for a list of standard PNG tEXt key/value pairs, go to [the official w3c spec for PNG](http://www.w3.org/TR/PNG/#11keywords)
