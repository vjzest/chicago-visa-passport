import dotenv from "dotenv";
dotenv.config();

const ENV = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI || 4000,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  SESSION_SECRET: process.env.SESSION_SECRET,
  NMI_API_URL: process.env.NMI_API_URL,
  NMI_SECURITY_KEY: process.env.NMI_SECURITY_KEY,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  FROM_EMAIL: process.env.FROM_EMAIL,
  JWT_PAYMENT_SECRET: process.env.JWT_PAYMENT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  USER_URL: process.env.USER_URL,
  FEDEX_BASE_URL: process.env.FEDEX_BASE_URL!,
  FEDEX_API_KEY: process.env.FEDEX_API_KEY!,
  FEDEX_SECRET: process.env.FEDEX_SECRET!,
  FEDEX_API_KEY2: process.env.FEDEX_API_KEY2!,
  FEDEX_SECRET2: process.env.FEDEX_SECRET2!,
  FEDEX_ACCOUNT_NUMBER: process.env.FEDEX_ACCOUNT_NUMBER!,
  FORM_FILLER_URL: process.env.FORM_FILLER_URL,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  TWILIONUMBER: process.env.TWILIONUMBER,
  CB911_USERNAME: process.env.CB911_USERNAME,
  CB911_PASSWORD: process.env.CB911_PASSWORD,
  CB911_BASE_URL: process.env.CB911_BASE_URL,
};

const missingEnvVars = Object.entries(ENV)
  .filter(([key, value]) => value === undefined)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  console.error(
    "Error: The following required environment variables are missing:",
  );
  missingEnvVars.forEach((key) => console.error(`- ${key}`));
  process.exit(1);
}

export default ENV;
