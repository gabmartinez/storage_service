# Storage Servicesss

## Deploy

```bash
docker build -t storage_save .
docker run --env-file .env --name storage_save -d -p 127.0.0.1:3000:3000 storage_save

docker logs -f --details storage_save
docker stop storage_save && docker rm storage_save
```
