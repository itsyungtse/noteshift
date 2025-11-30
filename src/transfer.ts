import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
	BlockObjectResponse,
	PartialBlockObjectResponse,
} from '@notionhq/client';

/** Convert only paragraphs → HTML (simple, enough for testing) */
// TODO: support more types
function blocksToHTML(
	blocks: (PartialBlockObjectResponse | BlockObjectResponse)[],
): string {
	let html = '';

	for (const block of blocks) {
		if ('type' in block && block.type === 'paragraph') {
			const texts = block.paragraph.rich_text || [];
			const plain = texts.map((t) => t.plain_text).join('');
			html += `<p>${escapeHTML(plain)}</p>`;
		}
	}

	return html;
}

function escapeHTML(str: string) {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function createAppleNote(title: string, bodyHTML: string) {
	const scriptPath = path.join(__dirname, 'create_note.applescript');
	execFileSync('osascript', [scriptPath, title, bodyHTML]);
}

export { blocksToHTML, createAppleNote };
