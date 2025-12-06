# noteshift

Move your notes easily between Notion and Apple Notes.

## Installation

```bash
npm install -g noteshift
# or
pnpm add -g noteshift
```

## Quick Start

```bash
# 1. Login with your Notion integration token
noteshift auth login

# 2. Transfer a Notion page to Apple Notes
noteshift transfer

# 3. Check authentication status
noteshift auth status

# 4. Logout when done
noteshift auth logout
```

## Prerequisites

1. **Notion Integration Token**: Create an internal integration at [Notion Integrations](https://www.notion.so/profile/integrations/)
2. **macOS with Apple Notes**: This tool uses AppleScript to interact with Apple Notes
3. **Share Pages with Integration**: Manually share the Notion pages you want to transfer with your integration

## Usage

### Authentication

Login once and the token will be securely stored in `~/.config/noteshift/config.json`:

```bash
noteshift auth login
```

Check your current authentication status:

```bash
noteshift auth status
```

Logout and remove stored credentials:

```bash
noteshift auth logout
```

### Transfer Notes

Transfer a Notion page to Apple Notes:

```bash
noteshift transfer
```

You'll be prompted to:
1. Enter the Notion page URL
2. (Optional) Enter a custom title for the Apple Note

The tool will:
- Fetch the Notion page content
- Convert it to Markdown
- Create a new note in Apple Notes under the "Notion Transfer" folder

### Token Priority

The tool looks for your Notion token in the following order:
1. Stored configuration file (`~/.config/noteshift/config.json`)
2. Environment variable (`NOTION_TOKEN`)
3. Interactive prompt (fallback)

## Programmatic Usage

You can also use noteshift as a library in your Node.js projects:

```typescript
import { ConfigManager, NotionService, createAppleNote, validateNotionToken } from 'noteshift';

// Configuration management
const config = new ConfigManager();
config.setToken('secret_xxx');

// Validate a token
const result = await validateNotionToken('secret_xxx');
if (result.valid) {
  console.log(`Logged in as: ${result.user.name}`);
}

// Fetch and transfer
const notion = new NotionService(config.getToken());
const markdown = await notion.fetchPageContent('notion-page-url');
createAppleNote('My Note', markdown);
```

## Resources

- [Notion Integrations](https://www.notion.so/profile/integrations/)
- [Notion API Documentation](https://developers.notion.com/)

## License

MIT
