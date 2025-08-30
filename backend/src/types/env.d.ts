declare namespace NodeJS {
  interface ProcessEnv {
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRY: string;
    REFRESH_TOKEN_EXPIRY: string;
    MONGODB_URL: string;
    GMAIL_USER: string;
    GMAIL_PASS: string;
    NODE_ENV: "development" | "production" | "test";
  }
}
