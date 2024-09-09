import dotenv from 'dotenv';
import path from 'path';



dotenv.config()

export const env = {
	dbUrl: path.resolve(__dirname, process.env.DB_URL ?? '../sqlite.db'),
}