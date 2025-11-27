import { execFileSync } from "child_process";
import { Client, ListBlockChildrenResponse } from "@notionhq/client";
import inquirer from "inquirer";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
if (!NOTION_TOKEN) {
    console.error("❌ Please set NOTION_TOKEN environment variable");
    process.exit(1);
}

const notion = new Client({
    auth: NOTION_TOKEN,
});

async function fetchPageContent(pageId: string) {
    const data: ListBlockChildrenResponse['results'] = [];

    while (true) {
        try {
            const response = await notion.blocks.children.list({
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

    return data
}

/** Convert only paragraphs → HTML (simple, enough for testing) */
function blocksToHTML(blocks: any[]): string {
    let html = "";

    for (const block of blocks) {
        if (block.type === "paragraph") {
            const texts = block.paragraph.rich_text || [];
            const plain = texts.map((t: any) => t.plain_text).join("");
            html += `<p>${escapeHTML(plain)}</p>`;
        }
    }

    return html;
}

function escapeHTML(str: string) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function createAppleNote(title: string, bodyHTML: string) {
    execFileSync("osascript", ["create_note.scpt", title, bodyHTML]);
}

async function main() {
  console.log("📦 Notion → Apple Notes Transfer CLI");

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "pageId",
      message: "Enter the Notion page ID to transfer:",
    },
    {
      type: "input",
      name: "noteTitle",
      message: "Enter the title for the Apple Note (leave empty to use Notion page name):",
    },
  ]);

  const { pageId, noteTitle } = answers;

  console.log("📥 Fetching Notion page content...");
  const blocks = await fetchPageContent(pageId);

  console.log("📝 Converting Notion content to HTML...");
  const html = blocksToHTML(blocks);

  const finalTitle = noteTitle || "Imported from Notion";

  console.log(`📤 Creating Apple Note: ${finalTitle}`);
  createAppleNote(finalTitle, html);

  console.log("✅ Transfer complete! Check Apple Notes → 'Notion Transfer' folder.");
}

main();
