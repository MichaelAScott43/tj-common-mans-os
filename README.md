# Steady
This is an app designed to help people who are in need of help globally.

## Developer Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- No global install needed — Expo is run via the project's npm scripts

### Running the App

After cloning the repo, install dependencies:

```bash
npm install
```

Then start the app:

```bash
npm start
```

`npm start` automatically detects your operating system:
- **macOS** — starts Expo for iOS + Android + Web
- **Windows / Linux** — starts Expo for Android only (skips the Xcode / App Store prerequisite that only works on macOS)

You can also target a specific platform explicitly:

```bash
npm run start:android   # Android only (all platforms)
npm run start:ios       # iOS only (macOS required)
npm run start:web       # Web only (all platforms)
```

#### On Windows or Linux (Android only)
iOS development requires macOS because Xcode — Apple's iOS build tool — only runs on macOS. If you ever run `npx expo start` directly (without using `npm start`) on Windows or Linux and see:

```
Error: Command failed: open https://apps.apple.com/us/app/id497799835
```

This means Expo is trying to open the Mac App Store to install Xcode, which is not possible on your operating system. Use `npm run start:android` or `npm run start:web` instead.

#### Building for iOS from Windows (EAS Build)
To build and test on real iOS devices from a Windows machine, use [Expo Application Services (EAS) Build](https://docs.expo.dev/build/introduction/), which runs builds in the cloud on Apple hardware:

```bash
npm install -g eas-cli
eas build --platform ios
```

### Why iOS Needs macOS
Apple requires that all iOS apps be compiled using Xcode, which is only available on macOS. This is an Apple platform restriction, not an Expo or project limitation. Windows and Linux developers can still contribute to the shared JavaScript/TypeScript code, run Android builds locally, and use EAS Build for cloud iOS builds.
