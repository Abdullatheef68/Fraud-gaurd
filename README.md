# FraudGuard — AI-Assisted Fraud Detection & Prevention Platform

> **"Detect fraud before it becomes a loss."**

FraudGuard is an AI-assisted fraud detection and prevention platform prototype built for hackathon demonstrations. It combines behavioural intelligence, deterministic risk scoring, network graph visualization, explainable risk signals, case investigations, adaptive learning feedback, and browser SHA-256 cryptographic evidence hashing.

---

## 🚀 Quickstart — Run Locally in Demo Mode

FraudGuard features an automatic **FALLBACK DEMO MODE**. It requires **zero external servers or API keys** to run immediately.

1. Open `index.html` or `login.html` directly in any web browser.
2. Click **Get Started** or **Sign In**.
3. Use the built-in demo credentials (or click the **Auto-fill Demo** button):
   - **Email**: `demo@fraudguard.ai`
   - **Password**: `Demo@123`
   - **Role**: `FRAUD ANALYST`
4. Experience the complete interactive dashboard, transaction simulator, graph analysis, and SHA-256 evidence verification.

---

## 🎯 Hackathon Demo Walkthrough Script

Follow these steps for a live presentation:

1. **Landing Page (`index.html`)**: Showcase the platform hero header ("Detect fraud before it becomes a loss"), security pillars, and click **EXPLORE PLATFORM**.
2. **Login (`login.html`)**: Click **Auto-fill Demo** (`demo@fraudguard.ai` / `Demo@123`) and click **Sign In**.
3. **Overview Dashboard (`dashboard.html`)**: Note the `DEMO MODE` badge in the header bar.
4. **Simulate Normal Transaction**: Click `NORMAL TRANSACTION` (₹850) → Observe Risk Score ~12/100 (`ALLOW`).
5. **Simulate Suspicious Transaction**: Click `SUSPICIOUS TRANSACTION` (₹18,200) → Observe Risk Score ~64/100 (`REQUIRE VERIFICATION`) and High-severity alert.
6. **Simulate High-Risk Fraud**: Click `HIGH-RISK FRAUD` (₹48,500) → Observe Risk Score ~94/100 (`BLOCKED`), automated Critical Alert, Investigation Case, and SHA-256 Evidence entry.
7. **Explainable Risk Breakdown**: Click transaction details → Inspect exact point contributions:
   - Amount Anomaly +20
   - New Device Fingerprint +18
   - New Location Mismatch +12
   - New Beneficiary +15
   - High Velocity Burst +14
   - Network Risk +15
8. **Network Graph Analysis (`graph.html`)**: Click **Graph Analysis** in sidebar → Inspect the interactive **Money Mule Ring** (Account A → B → C → D) and shared device node.
9. **Case Management (`investigations.html`)**: View open cases, add analyst notes, and resolve cases (`CONFIRM FRAUD` / `MARK GENUINE`).
10. **Evidence Audit Trail (`evidence.html`)**: View SHA-256 evidence records, click **🔐 Verify Hash** → Confirm `HASH MATCH`.
11. **Adaptive Learning (`learning.html`)**: Inspect analyst feedback stats and human-in-the-loop pipeline documentation.

---

## ⚙️ Google Apps Script Backend Deployment (Optional Cloud Sync)

To connect FraudGuard to a live cloud database powered by Google Sheets:

### Step 1: Create Google Sheet
1. Open [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it `FraudGuard Database`.

### Step 2: Open Apps Script Editor
1. In your Google Sheet, click **Extensions** → **Apps Script**.
2. Clear any existing code in `Code.gs`.
3. Open `backend/Code.gs` from this project, copy the entire file contents, and paste it into the editor.
4. Click **Save** (💾 icon).

### Step 3: Deploy as Web App
1. Click **Deploy** → **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Enter Description: `FraudGuard API v1.0`.
4. Set **Execute as**: `Me` (your email).
5. Set **Who has access**: `Anyone`.
6. Click **Deploy**.
7. Authorize access when prompted.
8. Copy the generated **Web App URL** (starts with `https://script.google.com/macros/s/.../exec`).

### Step 4: Configure FraudGuard
1. Open `js/config.js` in your project code.
2. Paste the URL into `API_URL`:
   ```javascript
   const CONFIG = {
       API_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
   };
   ```
3. Alternatively, open the running website, go to **Settings** (`settings.html`), paste the URL in the box, and click **Save Configuration**.

---

## 🔄 Switching Between Demo Mode and Real API Mode

- **Demo Mode**: Active whenever `API_URL` in `js/config.js` is empty `""`. Data is persisted locally in the browser (`localStorage`).
- **Real API Mode**: Active whenever `API_URL` is set. Data is saved directly into Google Sheets tabs (`Users`, `Transactions`, `Alerts`, `Investigations`, `Feedback`, `Evidence`, `FraudReports`).

---

## 📂 Project Structure

```
FraudGuard/
│
├── index.html                # Public Landing Page
├── login.html                # Auth Login Page
├── register.html             # Account Registration Page
├── forgot-password.html      # Password Reset Request Page
├── dashboard.html            # Main Analyst Overview Dashboard
├── transactions.html         # Transaction Log & Filters
├── transaction-detail.html   # Explainable Risk Breakdown Page
├── alerts.html               # Real-time Alert Queue Management
├── investigations.html       # Case Management Dashboard
├── graph.html                # Fraud Network Graph Visualization
├── learning.html             # Adaptive Learning & Feedback Stats
├── evidence.html             # Cryptographic Evidence Verification
├── profile.html              # User Profile Information
├── report-fraud.html         # Manual Fraud Reporting Interface
├── settings.html             # API Configuration & Demo Reset
├── 404.html                  # Custom 404 Error Page
│
├── css/
│   └── styles.css            # Cybersecurity SaaS Design System
│
├── js/
│   ├── config.js             # Configuration & API URL
│   ├── utils.js              # Formatting, SHA-256, Toast Helpers
│   ├── auth.js               # Auth Manager & Demo Credentials
│   ├── api.js                # Data API Interface (Local & Cloud)
│   ├── transactions.js       # Risk Engine v1.0 & Simulator
│   ├── dashboard.js          # Overview Dashboard Controller
│   ├── alerts.js             # Alerts Controller
│   ├── investigations.js     # Case Controller
│   ├── graph.js              # Network Graph Renderer
│   ├── learning.js           # Adaptive Learning Controller
│   └── evidence.js           # Cryptographic Evidence Controller
│
├── backend/
│   └── Code.gs               # Google Apps Script Backend Web App
│
├── README.md                 # Project Documentation
└── .gitignore                # Git Exclusions
```

---

## 🐙 GitHub Deployment

To push this repository to GitHub:

```bash
git init
git add .
git commit -m "Initial commit - FraudGuard complete working hackathon prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fraudguard-ai.git
git push -u origin main
```

---

## 📄 Hackathon Disclaimer

FraudGuard is a hackathon prototype designed for demonstration purposes. It is not connected to live banking networks or real-world payment processors.
