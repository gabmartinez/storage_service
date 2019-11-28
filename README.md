# Storage Services

## Deploy

```bash
docker build -t storage_service .
docker run --env-file .env --name storage_service -d -p 127.0.0.1:5000:5000 storage_service

docker logs -f --details storage_save
docker stop storage_service && docker rm storage_service
```

## Request

```json
{
    "bucket": "name",
    "acl": "public-read",
    "path": "upload/test/",
    "key": "upload/image_1.jpeg",
    "resizes": [{
        "width": 530,
        "height": 795
    }, {
        "width": 120,
        "height": 180
    }]
}
```
*note acl*: private, public-read, public-read-write, aws-exec-read, authenticated-read, bucket-owner-read, bucket-owner-full-control, log-delivery-write
