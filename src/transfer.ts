import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createAppleNote(title: string, bodyHTML: string) {
	const scriptPath = path.join(__dirname, 'create_note.applescript');
	execFileSync('osascript', [scriptPath, title, bodyHTML]);
}

export { createAppleNote };
