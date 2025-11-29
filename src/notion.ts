import { Client, type ListBlockChildrenResponse } from '@notionhq/client';

class NotionService {
	private client: Client;

	constructor(integrationKey?: string) {
		this.client = new Client({
			auth: integrationKey,
		});
	}

	async fetchPageContent(pageId: string) {
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
}

export { NotionService };
