import Conf from 'conf';

interface ConfigSchema {
	notionToken?: string;
}

class ConfigManager {
	private config: Conf<ConfigSchema>;

	constructor() {
		this.config = new Conf<ConfigSchema>({
			projectName: 'noteshift',
			// 配置文件路徑: ~/.config/noteshift/config.json
		});
	}

	setToken(token: string): void {
		this.config.set('notionToken', token);
	}

	getToken(): string | undefined {
		return this.config.get('notionToken');
	}

	clearToken(): void {
		this.config.delete('notionToken');
	}

	hasToken(): boolean {
		return this.config.has('notionToken');
	}

	getConfigPath(): string {
		return this.config.path;
	}
}

export { ConfigManager };
