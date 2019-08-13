const aws = require('aws-sdk');
const sharp = require('sharp');
const uuidv4 = require('uuid/v4');
require('dotenv').config();

const s3 = new aws.S3({
    endpoint: new aws.Endpoint(process.env.ENDPOINT),
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

async function getObject(params) {
    return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if (err) reject(err)
            resolve(data)
        });
    })
}

async function upload({ data, acl, contentType, path, format }) {
    const params = {
        Bucket: process.env.BUCKET,
        ACL: acl,
        ContentType: contentType,
        Key: path + uuidv4() + '.' + format,
        Body: data
    }
    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
}

async function resize(buffer, resize){
    return sharp(buffer).resize({
        width: parseInt(resize.width), 
        height: parseInt(resize.height),
        position: sharp.strategy.attention
    }).toBuffer({ resolveWithObject: true })
        .then(res =>  res).catch(err => {
            throw err
        })
}

module.exports.getObject = getObject;
module.exports.upload = upload;
module.exports.resize = resize;