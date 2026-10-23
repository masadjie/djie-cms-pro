const Minio = require('minio');
const logger = require('./logger');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || '127.0.0.1',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadminpassword'
});

const DEFAULT_BUCKET = process.env.MINIO_BUCKET || 'djie-cms-attachments';

/**
 * Ensure default bucket exists and configure public read policy for documents
 */
async function ensureBucketExists(bucketName = DEFAULT_BUCKET) {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      logger.info(`📦 MinIO Bucket '${bucketName}' created successfully.`);
      
      // Set read-only policy for public access
      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetBucketLocation", "s3:ListBucket"],
            Resource: [`arn:aws:s3:::${bucketName}`]
          },
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucketName}/*`]
          }
        ]
      };
      
      await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
      logger.info(`🔒 Public read policy applied to MinIO bucket '${bucketName}'.`);
    } else {
      logger.info(`📦 MinIO Bucket '${bucketName}' is ready.`);
    }
  } catch (err) {
    logger.warn(`⚠️ MinIO initialization warning: ${err.message}. Storage operations will retry on demand.`);
  }
}

module.exports = {
  minioClient,
  DEFAULT_BUCKET,
  ensureBucketExists
};
