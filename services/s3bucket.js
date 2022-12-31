const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
    "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
    "region": process.env.AWS_REGION
});

const s3Bucket = new AWS.S3({ params: {Bucket: process.env.AWS_BUCKET_NAME}});

async function fileUploadBase64(file_path,base64Image,contentType){
    buf = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""),'base64')
    let data = {
        Key: file_path,
        Body: buf,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: contentType
    }
    return await s3Bucket.putObject(data).promise();
}

async function deleteKey(file_path){
console.log('file_path :', file_path);
    const params = {  Bucket: process.env.AWS_BUCKET_NAME, Key: file_path }
    return await s3Bucket.deleteObject(params).promise();
}


module.exports = {
    fileUploadBase64,
    deleteKey
}