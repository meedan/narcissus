const aws = require('aws-sdk');
const fs = require('fs');
const narcissusConfig = require('./narcissusConfig');

exports.uploadScreenshot = async (name, path) => (
  new Promise((resolve) => {
    const s3ForcePathStyle = narcissusConfig.get('s3_path_style', true);
    const s3 = new aws.S3({
      accessKeyId: narcissusConfig.get('s3_access_key'),
      secretAccessKey: narcissusConfig.get('s3_secret_key'),
      endpoint: narcissusConfig.get('s3_endpoint'),
      region: narcissusConfig.get('s3_bucket_region'),
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
          Bucket: narcissusConfig.get('s3_bucket'),
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
