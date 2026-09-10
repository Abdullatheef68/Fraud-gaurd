/**
 * FraudGuard Utilities & Helpers
 */

function formatCurrency(amount) {
    if (isNaN(amount)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function getRiskBadge(score) {
    score = Number(score) || 0;
    if (score >= 71) {
        return `<span class="badge badge-high">HIGH (${score}/100)</span>`;
    } else if (score >= 31) {
        return `<span class="badge badge-medium">MEDIUM (${score}/100)</span>`;
    } else {
        return `<span class="badge badge-low">LOW (${score}/100)</span>`;
    }
}

function getDecisionBadge(decision) {
    if (!decision) return '<span class="badge badge-secondary">UNKNOWN</span>';
    const d = decision.toUpperCase();
    if (d.includes('BLOCK')) {
        return `<span class="badge badge-block">${decision}</span>`;
    } else if (d.includes('VERIFY') || d.includes('REQUIRE')) {
        return `<span class="badge badge-verify">${decision}</span>`;
    } else {
        return `<span class="badge badge-allow">${decision}</span>`;
    }
}

/**
 * SHA-256 cryptographic generator using Web Crypto API
 */
async function generateSHA256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : type === 'danger' ? '🚨' : type === 'warning' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Mobile Sidebar Navigation Toggle
 */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

/**
 * Render Header Badges & User Info across pages
 */
function setupGlobalUI() {
    // Inject topbar DEMO / API badge if topbar exists
    const topbarActions = document.querySelector('.topbar-actions');
    if (topbarActions && !document.getElementById('mode-indicator')) {
        const badge = document.createElement('div');
        badge.id = 'mode-indicator';
        if (CONFIG.DEMO_MODE) {
            badge.className = 'demo-mode-badge';
            badge.innerHTML = 'DEMO MODE';
            badge.title = 'Running locally with Browser Storage';
        } else {
            badge.className = 'api-mode-badge';
            badge.innerHTML = 'REAL API MODE';
            badge.title = 'Connected to Google Apps Script Backend';
        }
        topbarActions.insertBefore(badge, topbarActions.firstChild);
    }

    // Populate Sidebar User details if available
    const user = auth ? auth.getUser() : null;
    if (user) {
        const userNameEl = document.querySelector('.user-details .name');
        const userRoleEl = document.querySelector('.user-details .role');
        const userAvatarEl = document.querySelector('.user-avatar');

        if (userNameEl) userNameEl.textContent = user.fullName || user.email;
        if (userRoleEl) userRoleEl.textContent = user.role || 'FRAUD ANALYST';
        if (userAvatarEl) {
            const initials = (user.fullName || user.email || 'U').substring(0, 2).toUpperCase();
            userAvatarEl.textContent = initials;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupGlobalUI();
});
