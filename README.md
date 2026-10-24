# Chat Image Rotate

A tiny browser extension that adds a rotate button and keyboard shortcut to the
image viewer on WhatsApp Web, so sideways photos can be viewed upright.

> Not affiliated with, endorsed by, or connected to WhatsApp or Meta.
> WhatsApp is a trademark of its respective owner.

![Before and after](screenshots/before-after.gif)

## Features
- Rotate images in WhatsApp Web's own viewer, with no new tab
- **R** rotates clockwise, **Shift+R** counter-clockwise
- On-screen **Rotate** button while an image is open
- Resets when you open another image
- No data collected and no network requests

## Install
**Chrome / Edge / Brave:** <Chrome Web Store link>  (once published)
**Firefox:** <Add-ons link>  (once published)

**Manual install (developer mode):**
1. Download the latest zip from the Releases page and unzip it
2. Open `chrome://extensions` and turn on Developer mode
3. Click **Load unpacked** and select the unzipped folder
4. Reload WhatsApp Web

## Usage
Open any image in WhatsApp Web, then press **R** or click the **Rotate** button.

| Key | Action |
|---|---|
| R | Rotate 90° clockwise |
| Shift + R | Rotate 90° counter-clockwise |

The rotation only changes how the image looks in your browser. The original
file is not modified.

## Limitations
- Works on WhatsApp Web only (not the desktop app)
- WhatsApp may change its page layout, which can break detection of the viewer.
  If it stops working, please open an issue.

## Privacy
See [PRIVACY.md](PRIVACY.md). In short, nothing leaves your browser.

## Contributing
Bug reports and pull requests are welcome. Please include your browser and
version, and what you saw when it failed.

## License
MIT. See [LICENSE](LICENSE).