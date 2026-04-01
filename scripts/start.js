#!/usr/bin/env node
/**
 * Cross-platform Expo start script.
 *
 * On macOS: runs `expo start` (iOS + Android + Web).
 * On Windows / Linux: runs `expo start --android` to skip the Xcode /
 * App-Store prerequisite check that only works on macOS.
 */

const { execSync } = require('child_process');
const os = require('os');

const isMac = os.platform() === 'darwin';
const command = isMac ? 'expo start' : 'expo start --android';

console.log(`[start] Running: ${command}`);
try {
  execSync(command, { stdio: 'inherit' });
} catch (err) {
  // execSync throws when the child process exits with a non-zero status.
  // The child's output is already forwarded via stdio:'inherit', so we only
  // need to surface a clean exit code rather than a raw JS stack trace.
  process.exit(err.status ?? 1);
}
