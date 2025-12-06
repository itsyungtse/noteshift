import inquirer from 'inquirer';
import { marked } from 'marked';
import task from 'tasuku';
import { ConfigManager } from '../config.js';
import { NotionService } from '../notion.js';
import { createAppleNote } from '../transfer.js';

const config = new ConfigManager();
const NOTION_TOKEN = process.env.NOTION_TOKEN;

async function transferCommand(): Promise<void> {
    // 按優先級獲取 token: 配置文件 > 環境變量 > 交互式輸入
    let notionKey = config.getToken() || NOTION_TOKEN;

    if (!notionKey) {
        console.log(
            '⚠️  No Notion token found. Please login first or provide a token.\n',
        );
        const { integrationKey } = await inquirer.prompt([
            {
                type: 'password',
                name: 'integrationKey',
                message: 'Enter your Notion integration token:',
                mask: '*',
            },
        ]);
        notionKey = integrationKey;
    }

    const notion = new NotionService(notionKey);

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'pageId',
            message: 'Enter the Notion page URL to transfer:',
        },
        {
            type: 'input',
            name: 'noteTitle',
            message:
                'Enter the title for the Apple Note (leave empty to use Notion page name):',
        },
    ]);

    const { pageId, noteTitle } = answers;

    const fetchPageContentTask = await task(
        'Fetching Notion page content...',
        async ({ setTitle }) => {
            const response = await notion.fetchPageContent(pageId);
            setTitle('Successfully get Notion page content');
            return response;
        },
    );

    const finalTitle = noteTitle || 'Imported from Notion';

    task(`📤 Creating Apple Note: ${finalTitle}`, async ({ setTitle }) => {
        const text = fetchPageContentTask.result;
        if (typeof text !== 'string') return;
        const html = await marked(text);
        createAppleNote(finalTitle, html);

        setTitle('Transfer complete!!');
    });
}

export { transferCommand };
