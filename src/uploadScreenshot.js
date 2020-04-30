const aws = require('aws-sdk');
const fs = require('fs');
const config = require('./config');

exports.uploadScreenshot = async (name, path) => (
  new Promise((resolve) => {
    const s3ForcePathStyle = Object.keys(config.s3).indexOf('path_style') === -1 ? true : config.s3.path_style;
    const s3 = new aws.S3({
      accessKeyId: config.s3.access_key,
      secretAccessKey: config.s3.secret_key,
      endpoint: config.s3.endpoint,
      region: config.s3.bucket_region,
      signatureVersion: 'v4',
      s3ForcePathStyle,
    });

    (async () => {
      const buffer = await new Promise((resolve2) => {
        fs.readFile(path, (error, data) => {
          resolve2(data);
        });
      });

      const { Location } = await s3
        .upload({
          Bucket: config.s3.bucket,
          Key: `narcissus/screenshot-${name}.png`,
          Body: buffer,
          ACL: 'public-read',
          ContentType: 'image/png',
        })
        .promise();

      resolve(Location);
    })();
  })
);
