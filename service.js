const express = require('express');
const bodyParser = require('body-parser');
const controller = require('./controller')

const app = express();
app.use(bodyParser.json());

const BUCKET = process.env.BUCKET

app.get('/', function (req, response) {
    response.send('');
});

app.post('/resize', async function (req, res) {
    const config = req.body
    await controller.getObject({ Bucket: BUCKET, Key: config.key }).then(async ({ Body, ContentType }) => {
        var uploads = []
        await Promise.all(config.resizes.map(async (size) => {
            const { data, info } = await controller.resize(Body, size).then(data => data).catch(err => res.status(400).json(err))
            const { Location, Key, Bucket } = await controller.upload({ data, bucket: config.bucket, acl: config.acl, contentType: ContentType, path: config.path, format: info.format })
            uploads.push({ location: Location, key: Key, bucket: Bucket, width: size.width, height: size.height });
        }))
        res.json(uploads)
    }).catch(err => {
        console.log(err)
        res.status(400).json(err)
    });
});

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port ${server.address().port}!`);
});