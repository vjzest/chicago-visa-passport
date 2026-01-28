import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import ENV from "./lib/env.config";
import path from "path";

function extractS3KeyFromUrl(url: string): string | null {
  // Regex updated to handle both regional and non-regional endpoints
  const regex = new RegExp(
    `https://${ENV.S3_BUCKET_NAME}.s3(?:.[a-z0-9-]+)?\.amazonaws\.com/(.*)`
  );
  const match = url.match(regex);
  return match ? decodeURIComponent(match[1]) : null;
}

const s3Client = new S3Client({
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY_ID!,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY!,
  },
  region: ENV.AWS_REGION!,
});

/**
 * Function to upload a file to S3
 * @param file - The buffer of file to upload
 * @param filename - The name of the file
 * @param mimetype - The mimetype of the file
 * @param folder - The folder to upload to
 * @returns - Object containing properties 'filename' and 'url'
 */
export const uploadToS3 = async (
  file: Buffer,
  filename: string,
  mimetype: string,
  folder: string
) => {
  try {
    const fileExtension = path.extname(filename);
    const uniqueFileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${fileExtension}`;
    const key = `${folder}/${uniqueFileName}`;

    const command = new PutObjectCommand({
      Bucket: ENV.S3_BUCKET_NAME!,
      Key: key,
      Body: file,
      ContentType: mimetype,
    });

    await s3Client.send(command);

    // Construct the public URL using the format that works
    const publicUrl = `https://${ENV.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

    return {
      filename: key,
      url: publicUrl,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Function to delete a file from S3
 * @param url - The url of the file to delete
 * @returns - Nothing
 */
export const deleteFromS3 = async (url: string) => {
  try {
    if (url === "") return;
    const fileKey = extractS3KeyFromUrl(url);
    if (!fileKey) throw new Error("Invalid S3 URL");

    const command = new DeleteObjectCommand({
      Bucket: ENV.S3_BUCKET_NAME!,
      Key: fileKey,
    });

    await s3Client.send(command);
  } catch (error) {
    console.log(error);
  }
};
