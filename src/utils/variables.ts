import * as dotenv from 'dotenv';

dotenv.config();

export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseKey = process.env.SUPABASE_KEY;

export const adminPassword = process.env.ADMIN_PASSWORD;

export const jwtSecret = process.env.JWT_SECRET;

export const databaseUrl = process.env.DATABASE_URL;
export const databasePassword = process.env.DATABASE_PASSWORD;

export const redditAppName = process.env.REDDIT_APP_NAME;
export const redditUserName = process.env.REDDIT_USERNAME;
export const redditID = process.env.REDDIT_ID;
export const redditSecret = process.env.REDDIT_SECRET;

export const sarenaUID = process.env.SARENA_UID;
export const sarenaURI = process.env.SARENA_URI || 'https://sarena.onrender.com';

export const openaiApiKey = process.env.OPENAI_API_KEY;

export const linkedinID = process.env.LINKEDIN_ID;
export const linkedinSecret = process.env.LINKEDIN_SECRET;

export const rapidapiKey = process.env.RAPIDAPI_KEY;

export const port = process.env.PORT ? Number(process.env.PORT) : 3000;
export const origin = process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`;

export const updateInterval = process.env.UPDATE_INTERVAL ? Number(process.env.UPDATE_INTERVAL) : 60000;

export const gifExtension = 'gif';
export const videoExtensions = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'];
export const imageExtensionsWithoutGIF = ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'svg'];
export const imageExtensions = [...imageExtensionsWithoutGIF, gifExtension];
