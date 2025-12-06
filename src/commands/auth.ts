import inquirer from 'inquirer';
import { ConfigManager } from '../config.js';
import { validateNotionToken } from '../lib/validator.js';

const config = new ConfigManager();

const MAX_RETRIES = 3;

async function loginCommand(): Promise<void> {
    console.log('🔐 Login to Notion\n');

    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        const { token } = await inquirer.prompt([
            {
                type: 'password',
                name: 'token',
                message: 'Enter your Notion integration token:',
                mask: '*',
            },
        ]);

        console.log('\n⏳ Validating token...');

        const result = await validateNotionToken(token);

        if (result.valid && result.user) {
            config.setToken(token);
            console.log('✅ Token validated successfully!');
            console.log(`✅ Logged in as: ${result.user.name}`);
            if (result.user.email) {
                console.log(`   Email: ${result.user.email}`);
            }
            console.log(`   Config: ${config.getConfigPath()}\n`);
            return;
        }

        attempts++;
        console.log(`❌ ${result.error}`);

        if (attempts < MAX_RETRIES) {
            console.log(
                `\n⚠️  Please try again (${attempts}/${MAX_RETRIES} attempts used)\n`,
            );
        } else {
            console.log(
                '\n❌ Maximum retry attempts reached. Please check your token and try again later.\n',
            );
            process.exit(1);
        }
    }
}

async function logoutCommand(): Promise<void> {
    if (!config.hasToken()) {
        console.log('⚠️  You are not currently logged in.\n');
        return;
    }

    const { confirm } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure you want to logout?',
            default: false,
        },
    ]);

    if (confirm) {
        config.clearToken();
        console.log('✅ Successfully logged out');
        console.log(`   Token removed from: ${config.getConfigPath()}\n`);
    } else {
        console.log('❌ Logout cancelled\n');
    }
}

async function statusCommand(): Promise<void> {
    if (!config.hasToken()) {
        console.log('❌ Not logged in');
        console.log('   Run "noteshift auth login" to authenticate\n');
        return;
    }

    const token = config.getToken();
    if (!token) {
        console.log('❌ Not logged in\n');
        return;
    }

    console.log('⏳ Checking authentication status...\n');

    const result = await validateNotionToken(token);

    if (result.valid && result.user) {
        console.log('✅ Logged in');
        console.log(`   User: ${result.user.name}`);
        if (result.user.email) {
            console.log(`   Email: ${result.user.email}`);
        }
        console.log(`   Config: ${config.getConfigPath()}\n`);
    } else {
        console.log('❌ Token is invalid or expired');
        console.log(`   Error: ${result.error}`);
        console.log('   Run "noteshift auth login" to re-authenticate\n');
        config.clearToken();
    }
}

export { loginCommand, logoutCommand, statusCommand };
