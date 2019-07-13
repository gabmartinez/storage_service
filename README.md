# Storage Servicesss

## Deploy

```bash
docker build -t storage_save .
docker run --env-file .env --name storage_save -d -p 127.0.0.1:3000:3000 storage_save

docker logs -f --details storage_save
docker stop storage_save && docker rm storage_save
```

## Request

```json
{
    "bucket": "name", // bucket name
    "acl": "public-read", // private, public-read, public-read-write, aws-exec-read, authenticated-read, bucket-owner-read, bucket-owner-full-control, log-delivery-write
    "path": "upload/test/", // directory path
    "key": "upload/image_1.jpeg", // the original file path
    "resizes": [{
        "width": 530,
        "height": 795
    }, {
        "width": 120,
        "height": 180
    }]
}
```
