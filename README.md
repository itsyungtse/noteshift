# noteshift

Transfer notes between Notion and Apple Notes.

## Installation

```bash
npm install -g noteshift
# or
pnpm add -g noteshift
```

## Quick Start

```bash
# Login with your Notion integration token
noteshift auth login

# Transfer a Notion page to Apple Notes
noteshift transfer

# Check authentication status
noteshift auth status

# Logout
noteshift auth logout
```

## Usage

### Authentication

Login (token stored in `~/.config/noteshift/config.json`):

```bash
noteshift auth login
```

Check status:

```bash
noteshift auth status
```

Logout:

```bash
noteshift auth logout
```

### Transfer Notes

```bash
noteshift transfer
```

Prompts for:
1. Notion page URL
2. Custom title (optional)

Creates a note in Apple Notes under the "Notion Transfer" folder

### Token Priority

The tool looks for your Notion token in the following order:
1. Stored configuration file (`~/.config/noteshift/config.json`)
2. Environment variable (`NOTION_TOKEN`)
### Token Priority

1. Configuration file (`~/.config/noteshift/config.json`)
2. Environment variable (`NOTION_TOKEN`)
3. Interactive prompt
```typescript
import { ConfigManager, NotionService, createAppleNote, validateNotionToken } from 'noteshift';
## Programmatic Usage
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
