import { execFileSync } from 'node:child_process';
import type {
	BlockObjectResponse,
	PartialBlockObjectResponse,
} from '@notionhq/client';

/** Convert only paragraphs → HTML (simple, enough for testing) */
function blocksToHTML(
	blocks: (PartialBlockObjectResponse | BlockObjectResponse)[],
): string {
	let html = '';

	// TODO:FIX this error
	for (const block of blocks) {
		if (block.type === 'paragraph') {
			const texts = block.paragraph.rich_text || [];
			const plain = texts.map((t: any) => t.plain_text).join('');
			html += `<p>${escapeHTML(plain)}</p>`;
		}
	}

	return html;
}

function escapeHTML(str: string) {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function createAppleNote(title: string, bodyHTML: string) {
	execFileSync('osascript', ['./create_note.applescript', title, bodyHTML]);
}

export { blocksToHTML, createAppleNote };
