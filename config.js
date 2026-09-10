/**
 * FraudGuard Configuration
 */
const CONFIG = {
    // Paste your Google Apps Script Web App URL here after deployment:
    // Example: "https://script.google.com/macros/s/AKfycbx.../exec"
    API_URL: "",
    
    // Auto-detect Demo Mode: true if API_URL is empty, false if API_URL is set
    DEMO_MODE: true,

    APP_NAME: "FraudGuard",
    VERSION: "Risk Engine v1.0",
    
    // Default Demo Credentials
    DEMO_USER: {
        email: "demo@fraudguard.ai",
        password: "Demo@123",
        fullName: "Demo Analyst",
        organization: "CyberGuard Tech",
        role: "FRAUD ANALYST"
    }
};

// Auto-evaluate DEMO_MODE based on API_URL
if (CONFIG.API_URL && CONFIG.API_URL.trim() !== "") {
    CONFIG.DEMO_MODE = false;
} else {
    CONFIG.DEMO_MODE = true;
}
