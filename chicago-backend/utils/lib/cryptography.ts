import * as crypto from "crypto";
import * as dotenv from "dotenv";
import ENV from "./env.config";

// Load environment variables from .env file
dotenv.config();

const ENCRYPTION_KEY = ENV.ENCRYPTION_KEY!;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new Error(
    "ENCRYPTION_KEY must be a 32-byte hex string in the .env file."
  );
}

/**
 * Encrypt a string using AES-256-CBC with an environment variable as the key.
 * @param data The string to encrypt.
 * @returns The encrypted data in hex format.
 */
export function encrypt(data: string): string {
  // Generate a random initialization vector (IV)
  const iv = crypto.randomBytes(16);

  // Create a cipher instance
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );

  // Encrypt the data
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Combine IV and encrypted data
  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypt an encrypted string using AES-256-CBC with an environment variable as the key.
 * @param encryptedData The encrypted data in hex format (IV:Ciphertext).
 * @returns The decrypted string.
 */
export function decrypt(encryptedData: string): string {
  // Split the IV and the encrypted data
  const [ivHex, encryptedHex] = encryptedData.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");

  // Create a decipher instance
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );

  // Decrypt the data
  let decrypted = decipher.update(encryptedText.toString("hex"), "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
