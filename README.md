# BTC Strategy Lab PWA — GitHub Pages

This package is a mobile-installable PWA shell for the existing Google Apps Script dashboard. The dashboard itself stays hosted by Apps Script, so its existing `google.script.run` calls continue to work inside the iframe. This avoids exposing a new public JSON API from the Apps Script backend.

## Before publishing

1. Open the deployed BTC Strategy Lab Google Apps Script web app URL. It should end with `/exec`.
2. In this repository's `index.html`, replace:
   `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE`
   with the exact URL from **Deploy → Manage deployments → Web app**.
3. Commit the change. Do not put Telegram bot tokens or chat IDs in this repository.

The Apps Script web app must allow embedding (the current backend's `doGet()` uses `XFrameOptionsMode.ALLOWALL`). Keep the existing deployed Apps Script backend and its BTC-only scheduled trigger. Do not replace the backend or alter the separate BTC Alert app.

## Create the public GitHub repository

1. Sign in at https://github.com/new.
2. Repository name: `btc-strategy-lab-pwa` (or another name you prefer).
3. Select **Public**. Do not initialize with a README if you plan to upload these files as-is.
4. Create the repository, then choose **Add file → Upload files**.
5. Upload the contents of this folder (not the enclosing folder): `index.html`, `manifest.webmanifest`, `sw.js`, `README.md`, and the `icons` folder.
6. Commit the files to the `main` branch.
7. Open **Settings → Pages**. Under Build and deployment, select **Deploy from a branch**, branch `main`, folder `/(root)`, and Save.
8. Wait for the Pages deployment to finish. The site will be at `https://YOUR-GITHUB-USERNAME.github.io/btc-strategy-lab-pwa/`.

## Install on Android

1. Open the published Pages URL in Chrome on Android.
2. Wait for the dashboard to load.
3. Tap Chrome's three-dot menu → **Install app** or **Add to Home screen** (wording varies).
4. Confirm installation, then launch BTC Strategy Lab from the home screen.

## Behavior and limitations

- BTC, HYPE, SOL, ETH, and XAUT market selection and strategy logic continue to come from the existing Apps Script dashboard.
- Automatic scans remain BTC-only; manually changing the dashboard market does not change the scheduled scan.
- The service worker caches only the static PWA shell. It does not cache prices, signals, or the Apps Script dashboard, so live data needs internet access.
- This is an installable app shell, not a standalone API rewrite. The Apps Script page runs in an iframe. If the deployed web app URL requires a Google sign-in or cannot be embedded, adjust the Apps Script web app deployment/access settings appropriately and retest.
- Since the repository is public, never store secrets, API keys, Telegram credentials, or private sheet data in the repository.
