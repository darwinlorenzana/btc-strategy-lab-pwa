# BTC Strategy Lab — icon refresh fix

This patch fixes the icon-path mismatch in the uploaded PWA files.

## What was wrong
- `manifest.webmanifest` referenced `icons/btc-alert-192.png` and `icons/btc-alert-512.png`.
- `index.html` referenced `icons/icon-192.png`.
- `sw.js` precached the old `btc-alert-*` names and used cache version v1.

## Apply to GitHub
1. In your `darwinlorenzana/btc-strategy-lab-pwa` repository, upload/replace these files at the repository root:
   - `index.html`
   - `manifest.webmanifest`
   - `sw.js`
2. Upload the `icons` folder from this package, including:
   - `icons/icon-192-v2.png`
   - `icons/icon-512-v2.png`
3. Commit the changes to `main` and wait for GitHub Pages to publish.
4. Test these URLs in Chrome on Android:
   - `https://darwinlorenzana.github.io/btc-strategy-lab-pwa/manifest.webmanifest`
   - `https://darwinlorenzana.github.io/btc-strategy-lab-pwa/icons/icon-192-v2.png`
   - `https://darwinlorenzana.github.io/btc-strategy-lab-pwa/icons/icon-512-v2.png`
5. If those load correctly, uninstall the old BTC Strategy Lab app from Android and install it again from the GitHub Pages website.

The service worker cache was bumped to v2 and only deletes old caches with this app's own prefix, not unrelated origin caches. The Apps Script URL in `index.html` was preserved from your uploaded file. This does not modify the Apps Script backend or BTC Alert.
