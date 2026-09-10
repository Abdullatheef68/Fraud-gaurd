/**
 * FraudGuard Dashboard Page Controller
 */

async function initDashboard() {
    if (!auth.requireAuth()) return;

    await loadDashboardData();
}

async function loadDashboardData() {
    try {
        const res = await api.getDashboardData();
        if (res && res.success) {
            renderStats(res.stats);
            renderLiveTransactions(res.recentTransactions);
            renderRecentAlerts(res.recentAlerts);
            renderRecentInvestigations(res.recentInvestigations);
        }
    } catch (err) {
        console.error("Error loading dashboard data:", err);
        showToast("Error loading dashboard data", "danger");
    }
}

function renderStats(stats) {
    if (!stats) return;
    const elToday = document.getElementById('stat-today');
    const elSuspicious = document.getElementById('stat-suspicious');
    const elHighRisk = document.getElementById('stat-highrisk');
    const elBlocked = document.getElementById('stat-blocked');

    if (elToday) elToday.textContent = stats.todayCount || 0;
    if (elSuspicious) elSuspicious.textContent = stats.suspiciousCount || 0;
    if (elHighRisk) elHighRisk.textContent = stats.highRiskCount || 0;
    if (elBlocked) elBlocked.textContent = stats.blockedCount || 0;
}

function renderLiveTransactions(txns) {
    const container = document.getElementById('recent-txns-body');
    if (!container) return;

    if (!txns || txns.length === 0) {
        container.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding:24px;">No transactions recorded yet. Click a simulation button above to generate activity.</td></tr>`;
        return;
    }

    container.innerHTML = txns.map(t => {
        return `
            <tr>
                <td style="font-weight:600;"><a href="transaction-detail.html?id=${t.transactionId}">${t.transactionId}</a></td>
                <td>${formatCurrency(t.amount)}</td>
                <td>${t.accountTo || 'N/A'}</td>
                <td>${getRiskBadge(t.riskScore)}</td>
                <td>${getDecisionBadge(t.decision)}</td>
                <td style="color:#64748b; font-size:0.85rem;">${formatDate(t.timestamp)}</td>
            </tr>
        `;
    }).join('');
}

function renderRecentAlerts(alerts) {
    const container = document.getElementById('recent-alerts-list');
    if (!container) return;

    if (!alerts || alerts.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:#94a3b8; padding:20px;">No open alerts</div>`;
        return;
    }

    container.innerHTML = alerts.map(a => {
        const severityClass = a.severity === 'CRITICAL' ? 'badge-critical' : a.severity === 'HIGH' ? 'badge-high' : 'badge-medium';
        return `
            <div style="padding: 12px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span class="badge ${severityClass}" style="margin-right: 8px;">${a.severity}</span>
                    <strong style="font-size:0.9rem;">${a.alertId}</strong>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">${a.message}</div>
                </div>
                <a href="alerts.html" class="btn btn-sm btn-secondary">View</a>
            </div>
        `;
    }).join('');
}

function renderRecentInvestigations(cases) {
    const container = document.getElementById('recent-cases-list');
    if (!container) return;

    if (!cases || cases.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:#94a3b8; padding:20px;">No active investigations</div>`;
        return;
    }

    container.innerHTML = cases.map(c => {
        return `
            <div style="padding: 12px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong style="font-size: 0.9rem;">CASE #${c.caseId}</strong>
                    <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">Assigned: ${c.assignedUser || 'Analyst'}</div>
                </div>
                <span class="badge badge-info">${c.status}</span>
            </div>
        `;
    }).join('');
}

function refreshCurrentPage() {
    loadDashboardData();
}
