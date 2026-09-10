/**
 * FraudGuard Case Management & Investigation Controller
 */

let allCases = [];

async function initInvestigations() {
    if (!auth.requireAuth()) return;

    try {
        const response = await api.getInvestigations(100);
        if (response && response.success) {
            allCases = response.data;
            displayCases(allCases);
            updateCounts();
        }
    } catch (error) {
        console.error('Error loading cases:', error);
        showToast('Error loading investigation cases', 'danger');
    }
}

function displayCases(cases) {
    const container = document.getElementById('cases-container');
    if (!container) return;

    if (!cases || cases.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted);">No active investigation cases.</div>`;
        return;
    }

    container.innerHTML = cases.map(c => {
        const statusClass = c.status === 'OPEN' ? 'badge-warning' : c.status === 'IN_PROGRESS' ? 'badge-info' : 'badge-success';
        const statusText = c.status === 'OPEN' ? 'Open' : c.status === 'IN_PROGRESS' ? 'In Progress' : 'Resolved';

        return `
            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header" style="margin-bottom: 12px;">
                    <div>
                        <strong style="font-size: 1.15rem; color: var(--text-main);">CASE #${c.caseId}</strong>
                        <span style="font-size: 0.85rem; color: var(--text-muted); margin-left: 10px;">Transaction: ${c.transactionId}</span>
                    </div>
                    <span class="badge ${statusClass}">${statusText}</span>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; background: #f8fafc; padding: 16px; border-radius: var(--radius-sm); margin: 12px 0;">
                    <div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">Risk Score</div>
                        <div style="font-weight: 700; color: var(--danger); font-size: 1.1rem;">${c.riskScore}/100</div>
                    </div>
                    <div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">Assigned Analyst</div>
                        <div style="font-weight: 600; font-size: 0.9rem;">${c.assignedUser || 'demo@fraudguard.ai'}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">Created Date</div>
                        <div style="font-weight: 500; font-size: 0.88rem;">${formatDate(c.createdAt)}</div>
                    </div>
                </div>

                ${c.notes ? `<div style="background: #eff6ff; border-left: 4px solid var(--primary); padding: 12px 16px; border-radius: 4px; margin-bottom: 16px; font-size: 0.9rem; color: var(--text-main);"><strong>Analyst Notes:</strong> ${c.notes}</div>` : ''}

                <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; border-top: 1px solid var(--border-color); padding-top: 16px;">
                    <button class="btn btn-sm btn-danger" onclick="resolveOutcome('${c.caseId}', '${c.transactionId}', 'CONFIRM_FRAUD')">🚫 Confirm Fraud</button>
                    <button class="btn btn-sm btn-success" onclick="resolveOutcome('${c.caseId}', '${c.transactionId}', 'MARK_GENUINE')">✅ Mark Genuine</button>
                    <button class="btn btn-sm btn-secondary" onclick="updateCaseStatus('${c.caseId}', 'IN_PROGRESS')">⏳ Mark In Progress</button>
                    <button class="btn btn-sm btn-secondary" onclick="addNote('${c.caseId}')">📝 Add Note</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateCounts() {
    const open = allCases.filter(c => c.status === 'OPEN').length;
    const progress = allCases.filter(c => c.status === 'IN_PROGRESS').length;
    const resolved = allCases.filter(c => c.status === 'RESOLVED').length;

    if (document.getElementById('count-open')) document.getElementById('count-open').textContent = open;
    if (document.getElementById('count-progress')) document.getElementById('count-progress').textContent = progress;
    if (document.getElementById('count-resolved')) document.getElementById('count-resolved').textContent = resolved;
}

async function updateCaseStatus(caseId, newStatus) {
    const caseItem = allCases.find(c => c.caseId === caseId);
    if (caseItem) {
        caseItem.status = newStatus;
        await api.saveInvestigation(caseItem);
        displayCases(allCases);
        updateCounts();
        showToast(`Case #${caseId} updated to ${newStatus}`, 'info');
    }
}

async function addNote(caseId) {
    const note = prompt('Enter analyst case notes:');
    if (note && note.trim() !== '') {
        const caseItem = allCases.find(c => c.caseId === caseId);
        if (caseItem) {
            caseItem.notes = (caseItem.notes ? caseItem.notes + ' | ' : '') + note.trim();
            await api.saveInvestigation(caseItem);
            displayCases(allCases);
            showToast(`Note added to Case #${caseId}`, 'success');
        }
    }
}

async function resolveOutcome(caseId, transactionId, outcomeType) {
    const user = auth.getUser();
    const isFraud = outcomeType === 'CONFIRM_FRAUD';
    const confirmedOutcome = isFraud ? 'FRAUD' : 'GENUINE';

    // 1. Update case status to RESOLVED
    const caseItem = allCases.find(c => c.caseId === caseId);
    if (caseItem) {
        caseItem.status = 'RESOLVED';
        caseItem.notes = (caseItem.notes ? caseItem.notes + ' | ' : '') + `Outcome confirmed as ${confirmedOutcome} by ${user ? user.email : 'analyst'}`;
        await api.saveInvestigation(caseItem);
    }

    // 2. Submit to Adaptive Learning Feedback
    await api.saveFeedback({
        feedbackId: 'FBK-' + Date.now(),
        transactionId: transactionId,
        prediction: 'HIGH RISK',
        confirmedOutcome: confirmedOutcome,
        analyst: user ? user.email : 'demo@fraudguard.ai',
        timestamp: new Date().toISOString()
    });

    displayCases(allCases);
    updateCounts();

    showToast(`Case #${caseId} resolved. ${confirmedOutcome} outcome logged into Adaptive Learning pipeline.`, isFraud ? 'danger' : 'success');
}

function refreshCurrentPage() {
    initInvestigations();
}
