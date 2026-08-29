import { S3Client } from "@aws-sdk/client-s3";

const {
  CF_R2_ACCOUNT_ID,
  CF_R2_ACCESS_KEY_ID,
  CF_R2_SECRET_ACCESS_KEY,
  CF_R2_BUCKET,
} = process.env;

if (!(
  CF_R2_ACCOUNT_ID &&
  CF_R2_ACCESS_KEY_ID &&
  CF_R2_SECRET_ACCESS_KEY &&
  CF_R2_BUCKET
)) {
  throw new Error("Storage credentials undefined");
}

export const S3 = new S3Client({
  region: "auto", // Required by SDK but not used by R2
  // Provide your Cloudflare account ID
  endpoint: `https://${CF_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  // Retrieve your S3 API credentials for your R2 bucket via API tokens (see: https://developers.cloudflare.com/r2/api/tokens)
  credentials: {
    accessKeyId: CF_R2_ACCESS_KEY_ID,
    secretAccessKey: CF_R2_SECRET_ACCESS_KEY,
  },
});
