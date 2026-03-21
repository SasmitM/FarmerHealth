import { config } from 'dotenv';
import path from 'path';

// Load .env before any other modules (so GEMINI_API_KEY is available when gemini.ts loads)
config({ path: path.join(process.cwd(), '.env') });
if (!process.env.GEMINI_API_KEY) {
  config({ path: path.join(process.cwd(), 'backend', '.env') });
}
