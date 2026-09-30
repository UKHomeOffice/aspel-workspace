const { S3Client, CreateBucketCommand } = require('@aws-sdk/client-s3');

const bucket = process.env.S3_BUCKET;

const client = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_LOCALSTACK_URL,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET
  }
});

client.send(new CreateBucketCommand({ Bucket: bucket }))
  .then(() => {
    console.log(`[ci] created S3 bucket: ${bucket}`);
  })
  .catch(error => {
    if (['BucketAlreadyOwnedByYou', 'BucketAlreadyExists'].includes(error.name)) {
      console.log(`[ci] S3 bucket already exists: ${bucket}`);
      return;
    }

    throw error;
  })
  .catch(error => {
    console.error(`[ci] failed ensuring S3 bucket exists: ${bucket}`);
    console.error(error);
    process.exit(1);
  });
