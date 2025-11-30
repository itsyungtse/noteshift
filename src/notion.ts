import { Client, type ListBlockChildrenResponse } from '@notionhq/client';

class NotionService {
	private client: Client;

	constructor(integrationKey?: string) {
		this.client = new Client({
			auth: integrationKey,
		});
	}

	async fetchPageContent(url: string) {
		let pageId = this.extractPageId(url)

		if (!pageId) return []
		const data: ListBlockChildrenResponse['results'] = [];

		while (true) {
			try {
				const response = await this.client.blocks.children.list({
					block_id: pageId,
					page_size: 50,
				});
				data.push(...response.results);
				if (!response.has_more || !response.next_cursor) break;
				pageId = response.next_cursor;
			} catch (error) {
				break;
			}
		}

		return data;
	}

	private extractPageId(url: string): string | null {
		const match = url.match(/[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
		return match ? match[0] : null;
	}
}

export { NotionService };
