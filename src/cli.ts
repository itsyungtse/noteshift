#!/usr/bin/env node

import { Command } from 'commander';
import { loginCommand, logoutCommand, statusCommand } from './commands/auth.js';
import { transferCommand } from './commands/transfer.js';

const program = new Command();

program
	.name('noteshift')
	.description('Move your notes easily between Notion and Apple Notes')
	.version('1.0.0');

// auth 命令組
const auth = program
	.command('auth')
	.description('Manage Notion authentication');

auth
	.command('login')
	.description('Login to Notion with an integration token')
	.action(loginCommand);

auth
	.command('logout')
	.description('Logout and remove stored credentials')
	.action(logoutCommand);

auth
	.command('status')
	.description('Check authentication status')
	.action(statusCommand);

// transfer 命令
program
	.command('transfer')
	.description('Transfer a Notion page to Apple Notes')
	.action(transferCommand);

// 默認命令（向後兼容）
program.action(() => {
	console.log('📦 Notion → Apple Notes Transfer CLI\n');
	console.log('Usage:');
	console.log(
		'  noteshift auth login    - Login with Notion integration token',
	);
	console.log('  noteshift auth status   - Check authentication status');
	console.log('  noteshift auth logout   - Logout and clear credentials');
	console.log(
		'  noteshift transfer      - Transfer a Notion page to Apple Notes',
	);
	console.log('\nFor more information, run: noteshift --help\n');
});

program.parse();
