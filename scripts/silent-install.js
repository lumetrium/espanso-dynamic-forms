import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RELEASES_DIR = path.join(__dirname, '../release');

try {
    if (!fs.existsSync(RELEASES_DIR)) {
        console.error(`Releases directory not found at: ${RELEASES_DIR}`);
        process.exit(1);
    }

    const versions = fs.readdirSync(RELEASES_DIR).filter((file) => {
        return fs.statSync(path.join(RELEASES_DIR, file)).isDirectory() && /^\d+\.\d+\.\d+$/.test(file);
    });

    if (versions.length === 0) {
        console.error('No version directories found in release folder.');
        process.exit(1);
    }

    // Sort versions to find the latest
    versions.sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });

    const latestVersion = versions[versions.length - 1];
    console.log(`Latest version found: ${latestVersion}`);

    const installerPath = path.join(
        RELEASES_DIR,
        latestVersion,
        'Espanso-Dynamic-Forms-Win-Setup.exe'
    );

    if (!fs.existsSync(installerPath)) {
        console.error(`Installer not found at: ${installerPath}`);
        process.exit(1);
    }

    console.log(`Starting silent installation from: ${installerPath}`);

    const child = spawn(installerPath, ['/S'], {
        detached: true,
        stdio: 'ignore',
        shell: true,
    });

    child.unref();
    console.log('Installer launched silently.');
} catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
}
