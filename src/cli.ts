import inquirer from 'inquirer';
import { marked } from 'marked';
import task from 'tasuku';
import { NotionService } from './notion.js';
import { createAppleNote } from './transfer.js';

const NOTION_TOKEN = process.env.NOTION_TOKEN;

async function main() {
    console.log('📦 Notion → Apple Notes Transfer CLI');

    let notionKey = NOTION_TOKEN;
    if (!notionKey) {
        const { integrationKey } = await inquirer.prompt([
            {
                type: 'input',
                name: 'integrationKey',
                message: 'Enter your Notion integration key:',
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
        const text = fetchPageContentTask.result
        if (typeof text !== 'string') return
        const html = await marked(text)
        createAppleNote(finalTitle, html);

        setTitle('Transfer complete!!');
    });
}

main();
