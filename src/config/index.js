export const { DB, APP_PORT, MODE_ENV, APP_SECRET, APP_REFRESH_SECRET }=process.env;
export const IN_PROD = MODE_ENV === "production";
