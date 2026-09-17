const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

const endpoint = process.env.S3_LOCALSTACK_URL;
const timeoutSeconds = Number(process.env.LOCALSTACK_HEALTH_TIMEOUT_SECONDS || 120);

const client = new S3Client({
  region: process.env.S3_REGION,
  endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET
  }
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log(`[ci] waiting for LocalStack S3 API at ${endpoint}`);

  let lastErrorMessage = 'no response received';

  for (let attempt = 1; attempt <= timeoutSeconds; attempt++) {
    try {
      await client.send(new ListBucketsCommand({}));
      console.log(`[ci] LocalStack S3 API is ready after ${attempt}s`);
      return;
    } catch (error) {
      lastErrorMessage = error.message;

      if (attempt === 1 || attempt % 10 === 0) {
        console.log(`[ci] LocalStack S3 readiness check ${attempt}/${timeoutSeconds}: ${error.message}`);
      }
    }

    await sleep(1000);
  }

  throw new Error(`LocalStack S3 API did not become ready in time: ${endpoint} (last error: ${lastErrorMessage})`);
})().catch(error => {
  console.error('[ci] failed waiting for LocalStack S3 API');
  console.error(error);
  process.exit(1);
});
