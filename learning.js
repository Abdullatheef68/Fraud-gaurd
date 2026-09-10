/**
 * FraudGuard Adaptive Learning Controller
 */

async function initLearning() {
    if (!auth.requireAuth()) return;

    try {
        const response = await api.getFeedback(100);
        if (response && response.success) {
            renderFeedbackStats(response.data);
            renderFeedbackList(response.data);
        }
    } catch (error) {
        console.error('Error loading feedback:', error);
        showToast('Error loading feedback dataset', 'danger');
    }
}

function renderFeedbackStats(feedbackList) {
    const totalCount = (feedbackList || []).length;
    const confirmedFraud = (feedbackList || []).filter(f => f.confirmedOutcome === 'FRAUD').length;
    const falsePositives = (feedbackList || []).filter(f => f.confirmedOutcome === 'GENUINE').length;

    if (document.getElementById('feedback-samples')) document.getElementById('feedback-samples').textContent = totalCount;
    if (document.getElementById('confirmed-fraud-count')) document.getElementById('confirmed-fraud-count').textContent = confirmedFraud;
    if (document.getElementById('false-positives-count')) document.getElementById('false-positives-count').textContent = falsePositives;
}

function renderFeedbackList(feedbackList) {
    const container = document.getElementById('feedback-list-container');
    if (!container) return;

    if (!feedbackList || feedbackList.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 30px;">No feedback samples collected yet.</div>`;
        return;
    }

    container.innerHTML = feedbackList.map(f => {
        const isAccurate = f.confirmedOutcome === 'FRAUD';
        const badgeClass = isAccurate ? 'badge-success' : 'badge-warning';
        const badgeLabel = isAccurate ? 'Confirmed Fraud' : 'False Positive';

        return `
            <div style="background: #f8fafc; border: 1px solid var(--border-color); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">Transaction: <strong>${f.transactionId}</strong></div>
                    <div style="font-weight: 600; color: var(--text-main); margin-top: 4px;">Prediction: ${f.prediction || 'HIGH RISK'} → Confirmed: ${f.confirmedOutcome}</div>
                    <div style="font-size: 0.78rem; color: var(--text-light); margin-top: 4px;">Logged by: ${f.analyst || 'Analyst'} | ${formatDate(f.timestamp)}</div>
                </div>
                <span class="badge ${badgeClass}">${badgeLabel}</span>
            </div>
        `;
    }).join('');
}
