#!/usr/bin/env node
/**
 * Cross-platform Expo start script.
 *
 * Default behavior:
 * - macOS: `expo start` (iOS + Android + Web)
 * - Linux/Windows with Android SDK available: `expo start --android`
 * - Linux/Windows without Android SDK (e.g., cloud hosts like Render):
 *   `expo start --web`
 *
 * You can override with EXPO_START_TARGET=default|android|ios|web.
 */

const { execSync, spawnSync } = require('child_process');
const os = require('os');

function hasCommand(cmd, args = ['--version']) {
  const result = spawnSync(cmd, args, { stdio: 'ignore' });
  return result.status === 0 && !result.error;
}

function resolveStartCommand() {
  const override = (process.env.EXPO_START_TARGET || '').trim().toLowerCase();
  if (override) {
    switch (override) {
      case 'default':
        return 'expo start';
      case 'android':
        return 'expo start --android';
      case 'ios':
        return 'expo start --ios';
      case 'web':
        return 'expo start --web';
      default:
        console.warn(
          `[start] Unknown EXPO_START_TARGET="${override}". Falling back to auto-detection.`
        );
    }
  }

  const isMac = os.platform() === 'darwin';
  if (isMac) return 'expo start';

  // Cloud Linux environments often do not have Android SDK/adb installed.
  // If adb is unavailable, prefer web to avoid startup failure.
  if (!hasCommand('adb', ['version'])) {
    console.log('[start] Android SDK tools (adb) not found. Using web target.');
    return 'expo start --web';
  }

  return 'expo start --android';
}

const command = resolveStartCommand();

console.log(`[start] Running: ${command}`);
try {
  execSync(command, { stdio: 'inherit' });
} catch (err) {
  // execSync throws when the child process exits with a non-zero status.
  // The child's output is already forwarded via stdio:'inherit', so we only
  // need to surface a clean exit code rather than a raw JS stack trace.
  process.exit(err.status ?? 1);
}
