/**
 * FraudGuard Centralized API Interface
 * Automatically routes calls to Google Apps Script Web App or local DEMO MODE storage.
 */

const STORAGE_KEYS = {
    TRANSACTIONS: 'fg_demo_transactions',
    ALERTS: 'fg_demo_alerts',
    INVESTIGATIONS: 'fg_demo_investigations',
    FEEDBACK: 'fg_demo_feedback',
    EVIDENCE: 'fg_demo_evidence',
    FRAUD_REPORTS: 'fg_demo_fraud_reports'
};

const api = {
    /**
     * Helper to perform HTTP requests to Google Apps Script Backend
     */
    async _fetchAPI(action, payload = {}) {
        if (!CONFIG.API_URL) {
            throw new Error("Google Apps Script API URL is not configured. Switching to Demo Mode.");
        }

        try {
            const bodyData = JSON.stringify({ action, ...payload });
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: bodyData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            console.warn("API request failed, falling back to Demo Mode:", err);
            CONFIG.DEMO_MODE = true;
            showToast("Google API unavailable — switched to Demo Mode", "warning");
            return null;
        }
    },

    /**
     * Initial Seed Data for Local Demo Mode
     */
    initDemoData() {
        if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
            const sampleTxns = [
                {
                    transactionId: 'TXN-10023',
                    userId: 'USR-882194',
                    accountFrom: 'ACC-99412',
                    accountTo: 'ACC-11029',
                    amount: 48500,
                    riskScore: 94,
                    decision: 'BLOCKED',
                    reasons: ['Amount anomaly (+20)', 'New device (+18)', 'New location (+12)', 'New beneficiary (+15)', 'High velocity (+14)', 'Network risk (+15)'],
                    location: 'Mumbai, India',
                    device: 'iPhone 15 Pro (New)',
                    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
                    behaviourMatch: false
                },
                {
                    transactionId: 'TXN-10022',
                    userId: 'USR-339182',
                    accountFrom: 'ACC-55201',
                    accountTo: 'ACC-88310',
                    amount: 18200,
                    riskScore: 64,
                    decision: 'REQUIRE VERIFICATION',
                    reasons: ['Amount anomaly (+20)', 'New device (+18)', 'New location (+12)', 'New beneficiary (+14)'],
                    location: 'Delhi, India',
                    device: 'Pixel 8 (New)',
                    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
                    behaviourMatch: false
                },
                {
                    transactionId: 'TXN-10021',
                    userId: 'USR-100492',
                    accountFrom: 'ACC-12004',
                    accountTo: 'ACC-44910',
                    amount: 850,
                    riskScore: 12,
                    decision: 'ALLOW',
                    reasons: ['Normal transaction baseline'],
                    location: 'Bengaluru, India',
                    device: 'Samsung S23 (Trusted)',
                    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
                    behaviourMatch: true
                }
            ];
            localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(sampleTxns));
        }

        if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
            const sampleAlerts = [
                {
                    alertId: 'ALT-99120',
                    transactionId: 'TXN-10023',
                    severity: 'CRITICAL',
                    message: 'High Risk Fraud Attempt Detected - Amount ₹48,500 blocked due to network anomaly and new device fingerprint.',
                    status: 'OPEN',
                    createdAt: new Date(Date.now() - 15 * 60000).toISOString()
                },
                {
                    alertId: 'ALT-99119',
                    transactionId: 'TXN-10022',
                    severity: 'HIGH',
                    message: 'Suspicious Transaction - ₹18,200 verification required due to multi-signal baseline deviation.',
                    status: 'OPEN',
                    createdAt: new Date(Date.now() - 45 * 60000).toISOString()
                }
            ];
            localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(sampleAlerts));
        }

        if (!localStorage.getItem(STORAGE_KEYS.INVESTIGATIONS)) {
            const sampleCases = [
                {
                    caseId: 'FG-882109',
                    transactionId: 'TXN-10023',
                    riskScore: 94,
                    assignedUser: 'demo@fraudguard.ai',
                    status: 'OPEN',
                    notes: 'Initial automated flag triggered for ₹48,500 transfer. Connected to suspected mule ring.',
                    createdAt: new Date(Date.now() - 10 * 60000).toISOString()
                }
            ];
            localStorage.setItem(STORAGE_KEYS.INVESTIGATIONS, JSON.stringify(sampleCases));
        }

        if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) {
            const sampleFeedback = [
                {
                    feedbackId: 'FBK-1001',
                    transactionId: 'TXN_1726234567',
                    prediction: 'HIGH RISK',
                    confirmedOutcome: 'FRAUD',
                    analyst: 'demo@fraudguard.ai',
                    timestamp: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    feedbackId: 'FBK-1002',
                    transactionId: 'TXN_1726234566',
                    prediction: 'MEDIUM RISK',
                    confirmedOutcome: 'GENUINE',
                    analyst: 'demo@fraudguard.ai',
                    timestamp: new Date(Date.now() - 7200000).toISOString()
                }
            ];
            localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(sampleFeedback));
        }

        if (!localStorage.getItem(STORAGE_KEYS.EVIDENCE)) {
            const sampleEvidence = [
                {
                    evidenceId: 'EVIDENCE_1726234567',
                    transactionId: 'TXN-10023',
                    riskScore: 94,
                    decision: 'BLOCKED',
                    hash: 'a3f9b2e1c8d4f6g7h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1',
                    integrityVerified: true,
                    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
                    modelVersion: 'FraudGuard Risk Engine v1.0'
                }
            ];
            localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(sampleEvidence));
        }
    },

    // --- API Methods ---

    async login(email, password) {
        if (!CONFIG.DEMO_MODE) {
            const res = await this._fetchAPI('login', { email, password });
            if (res) return res;
        }
        return auth.login(email, password);
    },

    async register(data) {
        if (!CONFIG.DEMO_MODE) {
            const res = await this._fetchAPI('register', data);
            if (res) return res;
        }
        return auth.register(data);
    },

    async getTransactions(limit = 100) {
        if (!CONFIG.DEMO_MODE) {
            const res = await this._fetchAPI('getTransactions', { limit });
            if (res && res.success) return res;
        }
        this.initDemoData();
        const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        const data = raw ? JSON.parse(raw) : [];
        return { success: true, data: data.slice(0, limit) };
    },

    async saveTransaction(txn) {
        if (!CONFIG.DEMO_MODE) {
            const res = await this._fetchAPI('saveTransaction', { transaction: txn });
            if (res && res.success) return res;
        }
        this.initDemoData();
        const txns = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
        txns.unshift(txn);
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
        return { success: true, data: txn };
    },

    async getAlerts(limit = 100) {
        if (!CONFIG.DEMO_MODE) {
            const res = await this._fetchAPI('getAlerts', { limit });
            if (res && res.success) return res;
        }
        this.initDemoData();
        const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
        return { success: true, data: JSON.parse(raw || '[]') };
    },

    async saveAlert(alertItem) {
        if (!CONFIG.DEMO_MODE) {
            const res = await this._fetchAPI('saveAlert', { alert: alertItem });
            if (res && res.success) return res;
        }
        this.initDemoData();
        const alerts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALERTS) || '[]');
        alerts.unshift(alertItem);
        localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
        return { success: true, data: alertItem };
    },

    async getInvestigations(limit = 100) {
        if (!CONFIG.DEMO_MODE) {
            const res = await this._fetchAPI('getInvestigations', { limit });
            if (res && res.success) return res;
        }
        this.initDemoData();
        const raw = localStorage.getItem(STORAGE_KEYS.INVESTIGATIONS);
        return { success: true, data: JSON.parse(raw || '[]') };
    },

    async saveInvestigation(caseItem) {
        if (!CONFIG.DEMO_MODE) {
            const res = await this._fetchAPI('saveInvestigation', { investigation: caseItem });
            if (res && res.success) return res;
        }
        this.initDemoData();
        const cases = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVESTIGATIONS) || '[]');
        const idx = cases.findIndex(c => c.caseId === caseItem.caseId);
        if (idx >= 0) {
            cases[idx] = caseItem;
        } else {
            cases.unshift(caseItem);
        }
        localStorage.setItem(STORAGE_KEYS.INVESTIGATIONS, JSON.stringify(cases));
        return { success: true, data: caseItem };
    },

    async getFeedback(limit = 100) {
        if (!CONFIG.DEMO_MODE) {
            const res = await this._fetchAPI('getFeedback', { limit });
            if (res && res.success) return res;
        }
        this.initDemoData();
        const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
        return { success: true, data: JSON.parse(raw || '[]') };
    },

    async saveFeedback(feedbackItem) {
        if (!CONFIG.DEMO_MODE) {
            const res = await this._fetchAPI('saveFeedback', { feedback: feedbackItem });
            if (res && res.success) return res;
        }
        this.initDemoData();
        const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACK) || '[]');
        list.unshift(feedbackItem);
        localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(list));
        return { success: true, data: feedbackItem };
    },

    async getEvidence(limit = 100) {
        if (!CONFIG.DEMO_MODE) {
            const res = await this._fetchAPI('getEvidence', { limit });
            if (res && res.success) return res;
        }
        this.initDemoData();
        const raw = localStorage.getItem(STORAGE_KEYS.EVIDENCE);
        return { success: true, data: JSON.parse(raw || '[]') };
    },

    async saveEvidence(evidenceItem) {
        if (!CONFIG.DEMO_MODE) {
            const res = await this._fetchAPI('saveEvidence', { evidence: evidenceItem });
            if (res && res.success) return res;
        }
        this.initDemoData();
        const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVIDENCE) || '[]');
        list.unshift(evidenceItem);
        localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(list));
        return { success: true, data: evidenceItem };
    },

    async saveFraudReport(report) {
        if (!CONFIG.DEMO_MODE) {
            const res = await this._fetchAPI('saveFraudReport', { report });
            if (res && res.success) return res;
        }
        this.initDemoData();
        const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.FRAUD_REPORTS) || '[]');
        list.unshift({ ...report, reportId: 'RPT-' + Date.now(), createdAt: new Date().toISOString() });
        localStorage.setItem(STORAGE_KEYS.FRAUD_REPORTS, JSON.stringify(list));
        return { success: true, message: 'Fraud report recorded successfully.' };
    },

    async getDashboardData() {
        if (!CONFIG.DEMO_MODE) {
            const res = await this._fetchAPI('getDashboardData');
            if (res && res.success) return res;
        }
        this.initDemoData();
        const txns = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
        const alerts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALERTS) || '[]');
        const cases = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVESTIGATIONS) || '[]');

        const todayCount = txns.length;
        const suspiciousCount = txns.filter(t => t.riskScore >= 31 && t.riskScore < 71).length;
        const highRiskCount = txns.filter(t => t.riskScore >= 71).length;
        const blockedCount = txns.filter(t => t.decision === 'BLOCKED').length;

        return {
            success: true,
            stats: { todayCount, suspiciousCount, highRiskCount, blockedCount },
            recentTransactions: txns.slice(0, 10),
            recentAlerts: alerts.slice(0, 5),
            recentInvestigations: cases.slice(0, 5)
        };
    }
};

// Initialize demo data on script load
api.initDemoData();
