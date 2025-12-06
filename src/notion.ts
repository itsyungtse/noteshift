import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

class NotionService {
	private n2m: NotionToMarkdown;

	constructor(integrationKey?: string) {
		const notionClient = new Client({
			auth: integrationKey,
		});
		this.n2m = new NotionToMarkdown({ notionClient });
	}

	async fetchPageContent(url: string) {
		const pageId = this.extractPageId(url);

		if (!pageId) return [];
		const response = await this.n2m.pageToMarkdown(pageId);
		const text = this.n2m.toMarkdownString(response)
		return text.parent
	}

	private extractPageId(url: string): string | null {
		const match = url.match(
			/[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
		);
		return match ? match[0] : null;
	}
}

export { NotionService };
