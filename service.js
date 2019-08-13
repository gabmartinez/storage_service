const express = require('express');
const bodyParser = require('body-parser');
const controller = require('./controller');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const multer = require('multer');
const upload = multer();

var mime = require('mime-types')


const BUCKET = process.env.BUCKET

app.get('/', function (req, res) {
    res.send('<title>GO::GO::GO</title>');
});

app.post('/resize', async function (req, res) {
    const config = req.body
    await controller.getObject({ Bucket: BUCKET, Key: config.key }).then(async ({ Body, ContentType }) => {
        var uploads = []
        await Promise.all(config.resizes.map(async (size) => {
            const { data, info } = await controller.resize(Body, size).then(data => data).catch(err => res.status(400).json(err))
            const { Location, Key } = await controller.upload({ data, acl: config.acl, contentType: ContentType, path: config.path, format: info.format })
            uploads.push({ location: Location, key: Key, width: size.width, height: size.height });
        }))
        res.json(uploads)
    }).catch(err => {
        console.log(err)
        res.status(400).json(err)
    });
});

app.post('/upload', upload.single('file'), async function(req, res){
    const { width, height, acl, path, location } = req.body;
    const contentType = mime.lookup(req.file.originalname);
    const { data, info } = await controller.resize(req.file.buffer, { width, height }).then(data => data).catch(err => res.status(400).json(err))

    const { Location, Key } = await controller.upload({ data, acl, contentType, path: location + path, format: info.format })
    res.json({ location: Location, key: Key, path: Key.replace(location, ''), width, height }).status(201);
});

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port ${server.address().port}!`);
});