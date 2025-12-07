import { Client } from '@notionhq/client';

interface ValidationResult {
	valid: boolean;
	user?: {
		name: string;
		email?: string;
		id: string;
	};
	error?: string;
}

async function validateNotionToken(token: string): Promise<ValidationResult> {
	// 基本格式驗證
	if (!token || !token.startsWith('ntn_')) {
		return {
			valid: false,
			error:
				'Invalid token format. Notion integration tokens should start with "ntn_".',
		};
	}

	try {
		const notion = new Client({ auth: token });
		const response = await notion.users.me({});

		// 提取用戶信息
		const user = {
			id: response.id,
			name:
				response.type === 'person' && response.person?.email
					? response.person.email
					: response.name || 'Unknown',
			email:
				response.type === 'person' && response.person?.email
					? response.person.email
					: undefined,
		};

		return {
			valid: true,
			user,
		};
	} catch (error) {
		// 處理 Notion API 錯誤
		if (error instanceof Error) {
			return {
				valid: false,
				error: `Authentication failed: ${error.message}`,
			};
		}

		return {
			valid: false,
			error: 'Unknown error occurred during token validation.',
		};
	}
}

export { validateNotionToken };
export type { ValidationResult };
