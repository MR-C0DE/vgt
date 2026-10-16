import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'ca-central-1';
const bucket = process.env.S3_DOCUMENTS_BUCKET;

let client;

export function getDocumentsBucket() {
  if (!bucket) throw new Error('S3_DOCUMENTS_BUCKET is not configured');
  return bucket;
}

export function getS3Client() {
  if (!client) client = new S3Client({ region });
  return client;
}

export async function createDocumentUploadUrl({ key, contentType }) {
  return getSignedUrl(getS3Client(), new PutObjectCommand({
    Bucket: getDocumentsBucket(),
    Key: key,
    ContentType: contentType,
    ServerSideEncryption: 'AES256',
  }), { expiresIn: 300 });
}

export async function createDocumentReadUrl(key) {
  return getSignedUrl(getS3Client(), new GetObjectCommand({
    Bucket: getDocumentsBucket(),
    Key: key,
  }), { expiresIn: 900 });
}

export async function deleteStoredDocument(key) {
  if (!key) return;
  await getS3Client().send(new DeleteObjectCommand({ Bucket: getDocumentsBucket(), Key: key }));
}
