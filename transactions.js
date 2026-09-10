/**
 * FraudGuard Transaction & Risk Engine v1.0
 */

const RiskEngine = {
    // User baseline definitions for behavioural comparison
    BASELINE: {
        typicalAmount: 1500,
        typicalLocation: 'Mumbai, India',
        typicalDevice: 'Samsung S23 (Trusted)',
        typicalBeneficiary: 'ACC-12004'
    },

    /**
     * Deterministic Risk Calculation
     */
    calculateRisk(params) {
        const { amount, location, device, beneficiary, isNewDevice, isNewLocation, isNewBeneficiary, isHighVelocity, isNetworkRisk } = params;
        
        let score = 5; // Base noise
        const reasons = [];

        // 1. Amount Anomaly
        if (amount > this.BASELINE.typicalAmount * 10) {
            score += 25;
            reasons.push(`Amount anomaly (+25): ₹${amount.toLocaleString()} vs typical ₹${this.BASELINE.typicalAmount}`);
        } else if (amount > this.BASELINE.typicalAmount * 3) {
            score += 15;
            reasons.push(`Unusual amount size (+15): ₹${amount.toLocaleString()}`);
        }

        // 2. Device Fingerprint
        if (isNewDevice || device !== this.BASELINE.typicalDevice) {
            score += 18;
            reasons.push(`Unrecognized device fingerprint (+18): ${device || 'Unknown'}`);
        }

        // 3. Location Anomaly
        if (isNewLocation || location !== this.BASELINE.typicalLocation) {
            score += 12;
            reasons.push(`Geo-location mismatch (+12): ${location || 'Unknown'}`);
        }

        // 4. Beneficiary Relationship
        if (isNewBeneficiary || beneficiary !== this.BASELINE.typicalBeneficiary) {
            score += 15;
            reasons.push(`New unverified beneficiary (+15): ${beneficiary}`);
        }

        // 5. High Velocity Anomaly
        if (isHighVelocity) {
            score += 14;
            reasons.push(`High velocity burst (+14): Rapid transactions within 30s window`);
        }

        // 6. Graph / Network Risk
        if (isNetworkRisk) {
            score += 15;
            reasons.push(`Network risk (+15): Connected to flagged money mule cluster`);
        }

        // Cap score at 100
        score = Math.min(Math.max(score, 5), 98);

        // Decision logic
        let decision = 'ALLOW';
        if (score >= 71) {
            decision = 'BLOCKED';
        } else if (score >= 31) {
            decision = 'REQUIRE VERIFICATION';
        }

        return {
            riskScore: score,
            decision,
            reasons,
            behaviourMatch: score < 30
        };
    }
};

/**
 * Simulation Triggers
 */
async function triggerSimulation(type) {
    const user = auth.getUser() || { email: 'demo@fraudguard.ai' };
    const txnId = 'TXN-' + Math.floor(10000 + Math.random() * 90000);
    const now = new Date().toISOString();
    let txnPayload = {};

    if (type === 'NORMAL') {
        const evalResult = RiskEngine.calculateRisk({
            amount: 850,
            location: 'Mumbai, India',
            device: 'Samsung S23 (Trusted)',
            beneficiary: 'ACC-12004',
            isNewDevice: false,
            isNewLocation: false,
            isNewBeneficiary: false,
            isHighVelocity: false,
            isNetworkRisk: false
        });

        txnPayload = {
            transactionId: txnId,
            userId: user.email,
            accountFrom: 'ACC-99102',
            accountTo: 'ACC-12004',
            amount: 850,
            riskScore: evalResult.riskScore,
            decision: evalResult.decision,
            reasons: evalResult.reasons,
            location: 'Mumbai, India',
            device: 'Samsung S23 (Trusted)',
            timestamp: now,
            behaviourMatch: true
        };

        showToast(`Normal Transaction Simulated: ${txnId} (Risk: ${evalResult.riskScore}/100 - ALLOW)`, 'success');

    } else if (type === 'SUSPICIOUS') {
        const evalResult = RiskEngine.calculateRisk({
            amount: 18200,
            location: 'Delhi, India',
            device: 'Pixel 8 (New Device)',
            beneficiary: 'ACC-88310',
            isNewDevice: true,
            isNewLocation: true,
            isNewBeneficiary: true,
            isHighVelocity: false,
            isNetworkRisk: false
        });

        txnPayload = {
            transactionId: txnId,
            userId: user.email,
            accountFrom: 'ACC-99102',
            accountTo: 'ACC-88310',
            amount: 18200,
            riskScore: evalResult.riskScore,
            decision: evalResult.decision,
            reasons: evalResult.reasons,
            location: 'Delhi, India',
            device: 'Pixel 8 (New Device)',
            timestamp: now,
            behaviourMatch: false
        };

        // Create alert for suspicious
        await api.saveAlert({
            alertId: 'ALT-' + Math.floor(10000 + Math.random() * 90000),
            transactionId: txnId,
            severity: 'HIGH',
            message: `Suspicious transaction of ₹18,200 requires verification. Unrecognized device and location.`,
            status: 'OPEN',
            createdAt: now
        });

        showToast(`Suspicious Transaction Simulated: ${txnId} (Risk: ${evalResult.riskScore}/100 - VERIFY)`, 'warning');

    } else if (type === 'HIGH_RISK' || type === 'HIGH_RISK_FRAUD') {
        const evalResult = RiskEngine.calculateRisk({
            amount: 48500,
            location: 'Kolkata, India',
            device: 'Linux Chrome (Proxy IP)',
            beneficiary: 'ACC-MULE99',
            isNewDevice: true,
            isNewLocation: true,
            isNewBeneficiary: true,
            isHighVelocity: true,
            isNetworkRisk: true
        });

        txnPayload = {
            transactionId: txnId,
            userId: user.email,
            accountFrom: 'ACC-99102',
            accountTo: 'ACC-MULE99',
            amount: 48500,
            riskScore: evalResult.riskScore,
            decision: evalResult.decision,
            reasons: evalResult.reasons,
            location: 'Kolkata, India',
            device: 'Linux Chrome (Proxy IP)',
            timestamp: now,
            behaviourMatch: false
        };

        // Generate SHA-256 Evidence
        const canonicalData = JSON.stringify({
            txnId,
            amount: 48500,
            riskScore: evalResult.riskScore,
            decision: evalResult.decision,
            timestamp: now,
            modelVersion: 'FraudGuard Risk Engine v1.0'
        });
        const hash = await generateSHA256(canonicalData);

        await api.saveEvidence({
            evidenceId: 'EVIDENCE_' + Date.now(),
            transactionId: txnId,
            riskScore: evalResult.riskScore,
            decision: evalResult.decision,
            hash: hash,
            integrityVerified: true,
            timestamp: now,
            modelVersion: 'FraudGuard Risk Engine v1.0'
        });

        // Create Critical Alert
        await api.saveAlert({
            alertId: 'ALT-' + Math.floor(10000 + Math.random() * 90000),
            transactionId: txnId,
            severity: 'CRITICAL',
            message: `CRITICAL FRAUD BLOCKED: ₹48,500 transfer attempt to known mule network. High velocity burst & proxy IP.`,
            status: 'OPEN',
            createdAt: now
        });

        // Create Investigation Case
        await api.saveInvestigation({
            caseId: 'FG-' + Math.floor(100000 + Math.random() * 900000),
            transactionId: txnId,
            riskScore: evalResult.riskScore,
            assignedUser: user.email,
            status: 'OPEN',
            notes: 'High-risk automated block triggered. SHA-256 evidence vault entry generated.',
            createdAt: now
        });

        showToast(`HIGH-RISK FRAUD BLOCKED: ${txnId} (Risk: ${evalResult.riskScore}/100 - BLOCKED)`, 'danger');

    } else if (type === 'MONEY_MULE') {
        txnPayload = {
            transactionId: txnId,
            userId: user.email,
            accountFrom: 'ACC-RING-A',
            accountTo: 'ACC-RING-D',
            amount: 154000,
            riskScore: 97,
            decision: 'BLOCKED',
            reasons: [
                'Money Mule Ring (+25): Rapid multi-hop transfer chain detected',
                'Shared Device Fingerprint (+20): Same MAC/IP across 4 accounts',
                'High Velocity (+18): 8 transfers in under 60 seconds',
                'Amount anomaly (+15): Exceeds baseline profile by 100x',
                'Network topology (+19): Circular liquidity layer pattern'
            ],
            location: 'Distributed Proxy Network',
            device: 'Shared Automated Script Agent',
            timestamp: now,
            behaviourMatch: false
        };

        const canonicalData = JSON.stringify({ txnId, amount: 154000, riskScore: 97, decision: 'BLOCKED', timestamp: now });
        const hash = await generateSHA256(canonicalData);

        await api.saveEvidence({
            evidenceId: 'EVIDENCE_' + Date.now(),
            transactionId: txnId,
            riskScore: 97,
            decision: 'BLOCKED',
            hash: hash,
            integrityVerified: true,
            timestamp: now,
            modelVersion: 'FraudGuard Risk Engine v1.0'
        });

        await api.saveAlert({
            alertId: 'ALT-' + Math.floor(10000 + Math.random() * 90000),
            transactionId: txnId,
            severity: 'CRITICAL',
            message: 'MONEY MULE RING DETECTED: Rapid sequential transfer across accounts ACC-RING-A -> B -> C -> D.',
            status: 'OPEN',
            createdAt: now
        });

        await api.saveInvestigation({
            caseId: 'FG-MULE-' + Math.floor(1000 + Math.random() * 9000),
            transactionId: txnId,
            riskScore: 97,
            assignedUser: user.email,
            status: 'OPEN',
            notes: 'Mule ring pattern flagged. Visual network graph updated.',
            createdAt: now
        });

        showToast(`MONEY MULE RING BLOCKED: ${txnId} (Risk: 97/100)`, 'danger');
    }

    // Save transaction
    await api.saveTransaction(txnPayload);

    // Refresh UI if page supports it
    if (typeof refreshCurrentPage === 'function') {
        refreshCurrentPage();
    }
}
