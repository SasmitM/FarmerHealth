import { config } from 'dotenv';
import path from 'path';

// Load .env before any other modules (so OPENAI_API_KEY is available when openai.ts loads)
config({ path: path.join(process.cwd(), '.env') });
if (!process.env.OPENAI_API_KEY) {
  config({ path: path.join(process.cwd(), 'backend', '.env') });
}
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required. Add it to backend/.env');
}
