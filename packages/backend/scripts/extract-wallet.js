/**
 * Script to extract Oracle Wallet zip file for database connection.
 * Run: node scripts/extract-wallet.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const walletZip = path.resolve(__dirname, '..', 'assets', 'Wallet_WebNovelDB.zip');
const walletDir = path.resolve(__dirname, '..', 'assets', 'wallet');

if (!fs.existsSync(walletZip)) {
    console.error(`Wallet zip not found at: ${walletZip}`);
    process.exit(1);
}

if (!fs.existsSync(walletDir)) {
    fs.mkdirSync(walletDir, { recursive: true });
}

try {
    // Use PowerShell on Windows, unzip on Unix
    if (process.platform === 'win32') {
        execSync(
            `powershell -Command "Expand-Archive -Path '${walletZip}' -DestinationPath '${walletDir}' -Force"`,
        );
    } else {
        execSync(`unzip -o "${walletZip}" -d "${walletDir}"`);
    }
    console.log(`Wallet extracted to: ${walletDir}`);
} catch (err) {
    console.error('Failed to extract wallet:', err.message);
    process.exit(1);
}
