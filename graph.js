/**
 * FraudGuard Interactive Network Graph Analysis
 */

function initGraph() {
    if (!auth.requireAuth()) return;

    renderGraphCanvas();
}

function renderGraphCanvas() {
    const container = document.getElementById('graph-canvas-container');
    if (!container) return;

    // Render interactive SVG Fraud Graph
    container.innerHTML = `
        <svg width="100%" height="450" viewBox="0 0 800 450" style="background: #0f172a; border-radius: var(--radius-md); box-shadow: var(--shadow-md);">
            <defs>
                <linearGradient id="muleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ef4444" />
                    <stop offset="100%" stop-color="#dc2626" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            <!-- Connections / Transaction Flows -->
            <line x1="200" y1="120" x2="380" y2="120" stroke="#ef4444" stroke-width="3" stroke-dasharray="6,4" />
            <text x="290" y="110" fill="#fca5a5" font-size="11" text-anchor="middle">₹1,54,000 (Rapid Hop 1)</text>

            <line x1="380" y1="120" x2="560" y2="120" stroke="#ef4444" stroke-width="3" stroke-dasharray="6,4" />
            <text x="470" y="110" fill="#fca5a5" font-size="11" text-anchor="middle">₹1,45,000 (Rapid Hop 2)</text>

            <line x1="560" y1="120" x2="560" y2="280" stroke="#ef4444" stroke-width="3" stroke-dasharray="6,4" />
            <text x="580" y="200" fill="#fca5a5" font-size="11" text-anchor="middle">₹1,40,000 (Hop 3)</text>

            <line x1="560" y1="280" x2="380" y2="280" stroke="#ef4444" stroke-width="3" stroke-dasharray="6,4" />
            <text x="470" y="300" fill="#fca5a5" font-size="11" text-anchor="middle">Cashout / Layering</text>

            <!-- Device Connections -->
            <line x1="200" y1="120" x2="380" y2="380" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,3" />
            <line x1="380" y1="120" x2="380" y2="380" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,3" />
            <line x1="560" y1="120" x2="380" y2="380" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,3" />

            <!-- Shared Device Node -->
            <g transform="translate(380, 380)" style="cursor:pointer;" onclick="selectNode('Shared Device (Fingerprint #DEV-9912)', 'Identified across 3 accounts simultaneously within 2 minutes.')">
                <circle r="30" fill="#1e293b" stroke="#3b82f6" stroke-width="3" filter="url(#glow)"/>
                <text y="5" text-anchor="middle" fill="#93c5fd" font-size="20">📱</text>
                <text y="48" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">Shared Device (DEV-9912)</text>
            </g>

            <!-- Node A -->
            <g transform="translate(200, 120)" style="cursor:pointer;" onclick="selectNode('Account A (ACC-RING-A)', 'Source Account. Initiated rapid sequential multi-hop transfers.')">
                <circle r="28" fill="url(#muleGrad)" stroke="#ffffff" stroke-width="3" filter="url(#glow)"/>
                <text y="5" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">Account A</text>
                <text y="-36" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="bold">Mule Origin</text>
            </g>

            <!-- Node B -->
            <g transform="translate(380, 120)" style="cursor:pointer;" onclick="selectNode('Account B (ACC-RING-B)', 'Intermediate Relay Node. Held funds for 14 seconds before forwarding.')">
                <circle r="28" fill="url(#muleGrad)" stroke="#ffffff" stroke-width="3" filter="url(#glow)"/>
                <text y="5" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">Account B</text>
                <text y="-36" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">Relay Node</text>
            </g>

            <!-- Node C -->
            <g transform="translate(560, 120)" style="cursor:pointer;" onclick="selectNode('Account C (ACC-RING-C)', 'Secondary Hop Node. Triggered automated proxy script.')">
                <circle r="28" fill="url(#muleGrad)" stroke="#ffffff" stroke-width="3" filter="url(#glow)"/>
                <text y="5" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">Account C</text>
                <text y="-36" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">Relay Node</text>
            </g>

            <!-- Node D -->
            <g transform="translate(560, 280)" style="cursor:pointer;" onclick="selectNode('Account D (ACC-RING-D)', 'Final Liquidity Cashout Node. Flagged by Risk Engine (Risk 97/100).')">
                <circle r="30" fill="url(#muleGrad)" stroke="#ffffff" stroke-width="3" filter="url(#glow)"/>
                <text y="5" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">Account D</text>
                <text y="48" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="bold">Cashout Destination</text>
            </g>
        </svg>
    `;
}

function selectNode(name, details) {
    const infoBox = document.getElementById('node-info-box');
    if (infoBox) {
        infoBox.innerHTML = `
            <div style="background: #eff6ff; border-left: 4px solid var(--primary); padding: 16px; border-radius: var(--radius-sm);">
                <h4 style="color: var(--text-main); font-size: 1.05rem; margin-bottom: 6px;">🔍 ${name}</h4>
                <p style="color: var(--text-muted); font-size: 0.9rem;">${details}</p>
            </div>
        `;
    }
}
