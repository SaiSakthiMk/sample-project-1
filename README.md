# Wadhwani Foundation Certificate Clone (Demo Reference)

A pixel-perfect, fully functioning clone of the **Wadhwani Foundation Certificate Verification Web Application** for:
`https://web.certificate.wfglobal.org/en/certificate?certificateId=6ae0ca9dfa09ff77a70fd003`

---

## 📋 Features Cloned

- **Exact Visual Design & Layout**: Replicates header, logo, color palette (`#EAF5FF`, `#EDF5FF`, `#1890ff`), typography, responsive breakpoints, card styling, and footer links.
- **Certificate Verification Box**:
  - Wadhwani Foundation verification badge & emblem
  - Certificate ID: `6ae0ca9dfa09ff77a70fd003`
  - Recipient: `Harni Rajasri M D`
  - Course: `Self-Presentation`
  - Issued On: `Oct 27, 2026`
- **High-Resolution Certificate Image Preview**: 1450x1080 official certificate image with smooth loading states.
- **Working PDF Download**: Clicking "Download Certificate" downloads `Harni Rajasri M D_6ae0ca9dfa09ff77a70fd003.pdf`.
- **Dynamic Parameter Support**: Accepts any `?certificateId=...` in the URL and attempts live API queries against the backend service (`https://api.wfcommon.wfglobal.org/api/v1/certificateservice/get?certificateId=...`).
- **Error State**: Displays the official Not Found SVG illustration when an invalid certificate ID is requested.
- **100% Offline Capable**: Bundled with all local assets, logos, certificate PNG, and certificate PDF so the demo works without internet connectivity.

---

## 🚀 How to Run

### Option 1: Python Server (Recommended)
```bash
python3 server.py
```
Then visit:
```
http://localhost:3000/en/certificate?certificateId=6ae0ca9dfa09ff77a70fd003
```
or
```
http://localhost:3000/
```

### Option 2: Direct File Open
Open `index.html` directly in any web browser.

### Option 3: Node / NPX Serve
```bash
npm run serve
# or
npx serve .
```

---

## 📁 Project Structure

```
.
├── index.html              # Main application entry point
├── styles.css              # Pixel-perfect styles matching original CSS
├── app.js                  # Dynamic data loading & PDF download controller
├── server.py               # Lightweight local web server with route rewrites
├── package.json            # Node project configuration
├── assets/                 # Extracted high-res images, logos, vectors & documents
│   ├── cert.png            # 1450x1080 certificate image
│   ├── cert.pdf            # Authentic certificate PDF document
│   ├── wadhwani-logo.png   # Header navigation logo
│   ├── wf-emblem.png       # Verification box emblem icon
│   ├── facebook.svg        # Footer social icon
│   ├── linkedin.svg        # Footer social icon
│   ├── instagram.svg       # Footer social icon
│   ├── not_found.svg       # Fallback not found illustration
│   └── favicon.ico         # Official web favicon
└── en/
    └── certificate/
        └── index.html      # Path mirror for exact URL demo matching
```
