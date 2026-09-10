/**
 * FraudGuard Alerts Controller
 */

let allAlerts = [];

async function initAlerts() {
    if (!auth.requireAuth()) return;

    try {
        const response = await api.getAlerts(100);
        if (response && response.success) {
            allAlerts = response.data;
            displayAlerts(allAlerts);
            updateAlertCounts();
        }
    } catch (error) {
        console.error('Error loading alerts:', error);
        showToast('Error loading alerts', 'danger');
    }
}

function displayAlerts(alerts) {
    const container = document.getElementById('alerts-container');
    if (!container) return;

    if (!alerts || alerts.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted); font-weight: 500;">🚨 No active alerts. Everything looks secure!</div>`;
        return;
    }

    container.innerHTML = alerts.map(alert => {
        const severityLower = (alert.severity || 'MEDIUM').toLowerCase();
        const cardBorderClass = severityLower === 'critical' ? 'border-left: 5px solid var(--danger);' : severityLower === 'high' ? 'border-left: 5px solid var(--warning);' : 'border-left: 5px solid var(--info);';
        const badgeClass = severityLower === 'critical' ? 'badge-critical' : severityLower === 'high' ? 'badge-high' : 'badge-medium';

        return `
            <div class="card" style="${cardBorderClass} margin-bottom: 16px; padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <div>
                        <span class="badge ${badgeClass}" style="margin-right: 8px;">${alert.severity}</span>
                        <strong style="font-size: 1.1rem; color: var(--text-main);">${alert.alertId}</strong>
                        <span style="font-size: 0.85rem; color: var(--text-muted); margin-left: 10px;">Txn: ${alert.transactionId}</span>
                    </div>
                    <span class="badge badge-info">${alert.status || 'OPEN'}</span>
                </div>
                <div style="color: var(--text-main); font-size: 0.95rem; margin: 12px 0;">
                    ${alert.message}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; border-top: 1px solid var(--border-color); padding-top: 12px; color: var(--text-muted); font-size: 0.85rem;">
                    <span>Created: ${formatDate(alert.createdAt)}</span>
                    <div>
                        <button class="btn btn-sm btn-primary" onclick="investigateAlert('${alert.alertId}', '${alert.transactionId}')">🔍 Investigate</button>
                        <button class="btn btn-sm btn-secondary" onclick="dismissAlert('${alert.alertId}')">Dismiss</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateAlertCounts() {
    const critical = allAlerts.filter(a => (a.severity || '').toUpperCase() === 'CRITICAL').length;
    const high = allAlerts.filter(a => (a.severity || '').toUpperCase() === 'HIGH').length;
    const medium = allAlerts.filter(a => (a.severity || '').toUpperCase() === 'MEDIUM').length;
    const resolved = allAlerts.filter(a => a.status === 'RESOLVED').length;

    if (document.getElementById('count-critical')) document.getElementById('count-critical').textContent = critical;
    if (document.getElementById('count-high')) document.getElementById('count-high').textContent = high;
    if (document.getElementById('count-medium')) document.getElementById('count-medium').textContent = medium;
    if (document.getElementById('count-resolved')) document.getElementById('count-resolved').textContent = resolved;
}

function investigateAlert(alertId, transactionId) {
    if (transactionId && transactionId !== 'null') {
        window.location.href = `transaction-detail.html?id=${transactionId}`;
    } else {
        window.location.href = 'investigations.html';
    }
}

function dismissAlert(alertId) {
    allAlerts = allAlerts.filter(a => a.alertId !== alertId);
    displayAlerts(allAlerts);
    updateAlertCounts();
    showToast(`Alert ${alertId} dismissed`, 'info');
}

function refreshCurrentPage() {
    initAlerts();
}
