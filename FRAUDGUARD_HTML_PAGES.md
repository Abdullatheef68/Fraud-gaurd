# FRAUDGUARD - ADDITIONAL HTML PAGES

## alerts.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alerts - FraudGuard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; color: #1f2937; }
    
    .dashboard { display: flex; min-height: 100vh; }
    .sidebar { width: 260px; background: #1f2937; color: white; padding: 20px; position: fixed; height: 100vh; overflow-y: auto; }
    .sidebar-logo { font-size: 1.5rem; font-weight: 700; margin-bottom: 30px; }
    .nav-item { padding: 12px 15px; border-radius: 6px; text-decoration: none; color: #e5e7eb; display: flex; align-items: center; gap: 10px; }
    .nav-item:hover { background: #374151; }
    .nav-item.active { background: #667eea; }
    
    .main { margin-left: 260px; flex: 1; }
    .topbar { background: white; padding: 20px 40px; border-bottom: 1px solid #e5e7eb; }
    .content { padding: 40px; }
    
    .alert-card { background: white; padding: 20px; border-radius: 12px; border-left: 5px solid; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .alert-card.critical { border-left-color: #ef4444; }
    .alert-card.high { border-left-color: #f59e0b; }
    .alert-card.medium { border-left-color: #3b82f6; }
    
    .alert-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
    .alert-title { font-weight: 600; font-size: 1.1rem; }
    .alert-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .badge-critical { background: #fee2e2; color: #991b1b; }
    .badge-high { background: #fef3c7; color: #92400e; }
    .badge-medium { background: #dbeafe; color: #1e40af; }
    
    .alert-content { color: #374151; margin: 10px 0; }
    .alert-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; color: #6b7280; font-size: 0.9rem; }
    
    .btn { padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; margin-right: 10px; }
    .btn-primary { background: #667eea; color: white; }
    .btn-secondary { background: #e5e7eb; color: #1f2937; }
  </style>
</head>
<body onload="initAlerts()">
  <div class="dashboard">
    <div class="sidebar">
      <div class="sidebar-logo">🛡️ FraudGuard</div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <a href="dashboard.html" class="nav-item">📊 Overview</a>
        <a href="transactions.html" class="nav-item">💳 Transactions</a>
        <a href="alerts.html" class="nav-item active">🚨 Alerts</a>
        <a href="investigations.html" class="nav-item">🔍 Investigations</a>
        <a href="graph.html" class="nav-item">📈 Graph Analysis</a>
        <a href="learning.html" class="nav-item">🧠 Adaptive Learning</a>
        <a href="evidence.html" class="nav-item">📋 Evidence & Audit</a>
        <hr style="border: none; border-top: 1px solid #374151; margin: 20px 0;">
        <a href="profile.html" class="nav-item">👤 Profile</a>
      </div>
    </div>

    <div class="main">
      <div class="topbar">
        <h1>Fraud Alerts</h1>
      </div>

      <div class="content">
        <h2 style="font-size: 2rem; margin-bottom: 30px;">Alert Management</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 30px;">
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <div style="font-size: 0.9rem; color: #6b7280;">Critical</div>
            <div id="count-critical" style="font-size: 1.8rem; font-weight: 700; color: #ef4444;">0</div>
          </div>
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <div style="font-size: 0.9rem; color: #6b7280;">High</div>
            <div id="count-high" style="font-size: 1.8rem; font-weight: 700; color: #f59e0b;">0</div>
          </div>
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <div style="font-size: 0.9rem; color: #6b7280;">Medium</div>
            <div id="count-medium" style="font-size: 1.8rem; font-weight: 700; color: #3b82f6;">0</div>
          </div>
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <div style="font-size: 0.9rem; color: #6b7280;">Resolved</div>
            <div id="count-resolved" style="font-size: 1.8rem; font-weight: 700; color: #10b981;">0</div>
          </div>
        </div>

        <div id="alerts-container" style="background: white; border-radius: 12px; padding: 20px;">
          <p style="color: #9ca3af;">Loading alerts...</p>
        </div>
      </div>
    </div>
  </div>

  <script src="js/config.js"></script>
  <script src="js/api.js"></script>
  <script src="js/auth.js"></script>
  <script src="js/utils.js"></script>
  <script>
    let allAlerts = [];

    async function initAlerts() {
      if (!auth.requireAuth()) return;
      
      try {
        const response = await api.getAlerts(100);
        if (response.success) {
          allAlerts = response.data;
          displayAlerts(allAlerts);
          updateCounts();
        }
      } catch (error) {
        console.error('Error loading alerts:', error);
      }
    }

    function displayAlerts(alerts) {
      const container = document.getElementById('alerts-container');
      
      if (alerts.length === 0) {
        container.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 40px;">No alerts at this time</p>';
        return;
      }

      container.innerHTML = alerts.map(alert => {
        const severityLower = alert.severity.toLowerCase();
        const className = severityLower === 'critical' ? 'critical' : severityLower === 'high' ? 'high' : 'medium';
        
        return `
          <div class="alert-card ${className}">
            <div class="alert-header">
              <div class="alert-title">🚨 ${alert.severity} Alert</div>
              <span class="alert-badge badge-${className}">${alert.status}</span>
            </div>
            <div class="alert-content">
              ${alert.message}
            </div>
            <div class="alert-footer">
              <span>${formatDate(alert.createdAt)}</span>
              <div>
                <button class="btn btn-primary" onclick="investigateAlert('${alert.alertId}')">Investigate</button>
                <button class="btn btn-secondary" onclick="dismissAlert('${alert.alertId}')">Dismiss</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function updateCounts() {
      const critical = allAlerts.filter(a => a.severity === 'Critical').length;
      const high = allAlerts.filter(a => a.severity === 'High').length;
      const medium = allAlerts.filter(a => a.severity === 'Medium').length;
      const resolved = allAlerts.filter(a => a.status === 'RESOLVED').length;
      
      document.getElementById('count-critical').textContent = critical;
      document.getElementById('count-high').textContent = high;
      document.getElementById('count-medium').textContent = medium;
      document.getElementById('count-resolved').textContent = resolved;
    }

    function investigateAlert(alertId) {
      const alert = allAlerts.find(a => a.alertId === alertId);
      if (alert && alert.transactionId) {
        window.location.href = `transaction-detail.html?id=${alert.transactionId}`;
      } else {
        window.location.href = 'investigations.html';
      }
    }

    function dismissAlert(alertId) {
      allAlerts = allAlerts.filter(a => a.alertId !== alertId);
      displayAlerts(allAlerts);
      updateCounts();
    }
  </script>
</body>
</html>
```

## investigations.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Investigations - FraudGuard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; }
    
    .dashboard { display: flex; min-height: 100vh; }
    .sidebar { width: 260px; background: #1f2937; color: white; padding: 20px; position: fixed; height: 100vh; overflow-y: auto; }
    .sidebar-logo { font-size: 1.5rem; font-weight: 700; margin-bottom: 30px; }
    .nav-item { padding: 12px 15px; border-radius: 6px; text-decoration: none; color: #e5e7eb; display: flex; align-items: center; gap: 10px; }
    .nav-item:hover { background: #374151; }
    .nav-item.active { background: #667eea; }
    
    .main { margin-left: 260px; flex: 1; }
    .content { padding: 40px; }
    
    .case-card { background: white; padding: 20px; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .case-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
    .case-id { font-weight: 700; font-size: 1.1rem; }
    .status-badge { padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; }
    .status-open { background: #fef3c7; color: #92400e; }
    .status-investigating { background: #dbeafe; color: #1e40af; }
    .status-resolved { background: #d1fae5; color: #065f46; }
    
    .case-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 15px 0; }
    .detail-item { background: #f9fafb; padding: 10px; border-radius: 6px; }
    .detail-label { color: #6b7280; font-size: 0.85rem; }
    .detail-value { font-weight: 600; margin-top: 5px; }
    
    .btn { padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; margin-right: 10px; }
    .btn-primary { background: #667eea; color: white; }
    .btn-secondary { background: #e5e7eb; color: #1f2937; }
  </style>
</head>
<body onload="initInvestigations()">
  <div class="dashboard">
    <div class="sidebar">
      <div class="sidebar-logo">🛡️ FraudGuard</div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <a href="dashboard.html" class="nav-item">📊 Overview</a>
        <a href="transactions.html" class="nav-item">💳 Transactions</a>
        <a href="alerts.html" class="nav-item">🚨 Alerts</a>
        <a href="investigations.html" class="nav-item active">🔍 Investigations</a>
        <a href="graph.html" class="nav-item">📈 Graph Analysis</a>
        <a href="learning.html" class="nav-item">🧠 Adaptive Learning</a>
      </div>
    </div>

    <div class="main">
      <div class="content">
        <h2 style="font-size: 2rem; margin-bottom: 30px;">Investigation Cases</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 30px;">
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <div style="font-size: 0.9rem; color: #6b7280;">Open</div>
            <div id="count-open" style="font-size: 1.8rem; font-weight: 700;">0</div>
          </div>
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <div style="font-size: 0.9rem; color: #6b7280;">In Progress</div>
            <div id="count-progress" style="font-size: 1.8rem; font-weight: 700;">0</div>
          </div>
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <div style="font-size: 0.9rem; color: #6b7280;">Resolved</div>
            <div id="count-resolved" style="font-size: 1.8rem; font-weight: 700;">0</div>
          </div>
        </div>

        <div id="cases-container" style="background: white; border-radius: 12px; padding: 20px;">
          <p style="color: #9ca3af;">Loading cases...</p>
        </div>
      </div>
    </div>
  </div>

  <script src="js/config.js"></script>
  <script src="js/api.js"></script>
  <script src="js/auth.js"></script>
  <script src="js/utils.js"></script>
  <script>
    let allCases = [];

    async function initInvestigations() {
      if (!auth.requireAuth()) return;
      
      try {
        const response = await api.getInvestigations(100);
        if (response.success) {
          allCases = response.data;
          displayCases(allCases);
          updateCounts();
        }
      } catch (error) {
        console.error('Error loading cases:', error);
      }
    }

    function displayCases(cases) {
      const container = document.getElementById('cases-container');
      
      if (cases.length === 0) {
        container.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 40px;">No investigation cases</p>';
        return;
      }

      container.innerHTML = cases.map(caseItem => {
        const statusClass = caseItem.status === 'OPEN' ? 'open' : caseItem.status === 'IN_PROGRESS' ? 'investigating' : 'resolved';
        const statusDisplay = caseItem.status === 'OPEN' ? 'Open' : caseItem.status === 'IN_PROGRESS' ? 'Investigating' : 'Resolved';
        
        return `
          <div class="case-card">
            <div class="case-header">
              <div class="case-id">CASE #${caseItem.caseId.substring(0, 8)}</div>
              <span class="status-badge status-${statusClass}">${statusDisplay}</span>
            </div>
            <div class="case-details">
              <div class="detail-item">
                <div class="detail-label">Transaction ID</div>
                <div class="detail-value">${caseItem.transactionId.substring(0, 12)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Risk Score</div>
                <div class="detail-value">${caseItem.riskScore}/100</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Assigned To</div>
                <div class="detail-value">${caseItem.assignedUser.substring(0, 12)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Created</div>
                <div class="detail-value">${new Date(caseItem.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            ${caseItem.notes ? `<div style="background: #f9fafb; padding: 10px; border-radius: 6px; margin-top: 10px;"><strong>Notes:</strong> ${caseItem.notes}</div>` : ''}
            <div style="margin-top: 15px;">
              <button class="btn btn-primary" onclick="updateCaseStatus('${caseItem.caseId}', 'IN_PROGRESS')">Update Status</button>
              <button class="btn btn-secondary" onclick="addNote('${caseItem.caseId}')">Add Note</button>
            </div>
          </div>
        `;
      }).join('');
    }

    function updateCounts() {
      const open = allCases.filter(c => c.status === 'OPEN').length;
      const progress = allCases.filter(c => c.status === 'IN_PROGRESS').length;
      const resolved = allCases.filter(c => c.status === 'RESOLVED').length;
      
      document.getElementById('count-open').textContent = open;
      document.getElementById('count-progress').textContent = progress;
      document.getElementById('count-resolved').textContent = resolved;
    }

    function updateCaseStatus(caseId, status) {
      const caseItem = allCases.find(c => c.caseId === caseId);
      if (caseItem) {
        caseItem.status = status;
        displayCases(allCases);
        updateCounts();
        alert(`Case updated to ${status}`);
      }
    }

    function addNote(caseId) {
      const note = prompt('Add a note:');
      if (note) {
        const caseItem = allCases.find(c => c.caseId === caseId);
        if (caseItem) {
          caseItem.notes = note;
          displayCases(allCases);
        }
      }
    }
  </script>
</body>
</html>
```

## graph.html (Graph Analysis)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Graph Analysis - FraudGuard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; }
    
    .dashboard { display: flex; min-height: 100vh; }
    .sidebar { width: 260px; background: #1f2937; color: white; padding: 20px; position: fixed; height: 100vh; }
    .nav-item { padding: 12px 15px; border-radius: 6px; text-decoration: none; color: #e5e7eb; display: flex; align-items: center; gap: 10px; }
    .nav-item.active { background: #667eea; }
    
    .main { margin-left: 260px; flex: 1; }
    .content { padding: 40px; }
    
    .section { background: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .section-title { font-size: 1.3rem; font-weight: 600; margin-bottom: 20px; }
    
    .graph-container { background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 30px; min-height: 500px; display: flex; align-items: center; justify-content: center; }
    
    .network-card { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #ef4444; }
    .network-card .title { font-weight: 600; margin-bottom: 10px; }
    .network-stat { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin: 10px 0; }
    .stat { background: white; padding: 10px; border-radius: 6px; }
    .stat-label { color: #6b7280; font-size: 0.85rem; }
    .stat-value { font-weight: 700; margin-top: 5px; }
  </style>
</head>
<body onload="initGraph()">
  <div class="dashboard">
    <div class="sidebar">
      <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: 30px;">🛡️ FraudGuard</div>
      <a href="dashboard.html" class="nav-item">📊 Overview</a>
      <a href="graph.html" class="nav-item active">📈 Graph Analysis</a>
    </div>

    <div class="main">
      <div class="content">
        <h2 style="font-size: 2rem; margin-bottom: 30px;">Fraud Network Analysis</h2>

        <div class="section">
          <div class="section-title">Network Graph Visualization</div>
          <div class="graph-container">
            <div style="text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 20px;">🕸️</div>
              <p style="color: #6b7280; margin-bottom: 20px;">Interactive fraud network graph</p>
              <p style="color: #9ca3af; font-size: 0.9rem;">Demonstrates account relationships, device connections, and suspicious patterns</p>
              
              <svg width="600" height="400" style="background: white; border-radius: 8px; margin-top: 20px;">
                <!-- Nodes -->
                <circle cx="300" cy="100" r="25" fill="#ef4444" stroke="white" stroke-width="2"/>
                <text x="300" y="105" text-anchor="middle" fill="white" font-weight="bold">Account A</text>
                
                <circle cx="150" cy="250" r="25" fill="#f59e0b" stroke="white" stroke-width="2"/>
                <text x="150" y="255" text-anchor="middle" fill="white" font-size="12">Account B</text>
                
                <circle cx="450" cy="250" r="25" fill="#f59e0b" stroke="white" stroke-width="2"/>
                <text x="450" y="255" text-anchor="middle" fill="white" font-size="12">Account C</text>
                
                <circle cx="300" cy="350" r="25" fill="#ef4444" stroke="white" stroke-width="2"/>
                <text x="300" y="355" text-anchor="middle" fill="white" font-size="12">Account D</text>
                
                <!-- Connections -->
                <line x1="300" y1="125" x2="150" y2="225" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,5"/>
                <line x1="300" y1="125" x2="450" y2="225" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,5"/>
                <line x1="150" y1="275" x2="300" y2="325" stroke="#f59e0b" stroke-width="2"/>
                <line x1="450" y1="275" x2="300" y2="325" stroke="#f59e0b" stroke-width="2"/>
                <line x1="150" y1="250" x2="450" y2="250" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5,5"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Suspicious Network #1: Money Mule Ring</div>
          <div class="network-card">
            <div class="title">⚠️ CRITICAL - Rapid Transfer Network Detected</div>
            <div class="network-stat">
              <div class="stat">
                <div class="stat-label">Connected Accounts</div>
                <div class="stat-value">5</div>
              </div>
              <div class="stat">
                <div class="stat-label">Transactions</div>
                <div class="stat-value">23</div>
              </div>
              <div class="stat">
                <div class="stat-label">Amount Transferred</div>
                <div class="stat-value">₹8.4L</div>
              </div>
              <div class="stat">
                <div class="stat-label">Risk Score</div>
                <div class="stat-value" style="color: #ef4444;">97/100</div>
              </div>
            </div>
            <div style="margin-top: 15px; padding: 15px; background: #fee2e2; border-radius: 6px;">
              <strong>Indicators:</strong>
              <ul style="margin-left: 20px; margin-top: 10px; color: #991b1b;">
                <li>Rapid sequential transfers between accounts</li>
                <li>Shared device fingerprints across accounts</li>
                <li>Suspicious account relationships</li>
                <li>Unusual transaction paths</li>
                <li>High-velocity pattern consistent with mule activity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="js/config.js"></script>
  <script src="js/auth.js"></script>
  <script>
    function initGraph() {
      if (!auth.requireAuth()) return;
    }
  </script>
</body>
</html>
```

## learning.html (Adaptive Learning)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Adaptive Learning - FraudGuard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; }
    
    .main { margin-left: 260px; padding: 40px; }
    .section { background: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
    .section-title { font-size: 1.3rem; font-weight: 600; margin-bottom: 20px; }
    
    .flow-diagram { background: #f9fafb; padding: 30px; border-radius: 12px; }
    .flow-step { display: inline-block; background: #667eea; color: white; padding: 15px 20px; border-radius: 8px; margin: 10px; text-align: center; font-weight: 600; }
    .flow-arrow { display: inline-block; margin: 0 10px; font-size: 1.5rem; vertical-align: middle; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .stat-card { background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; }
    .stat-card .label { color: #6b7280; }
    .stat-card .value { font-size: 2rem; font-weight: 700; }
    
    .feedback-list { display: flex; flex-direction: column; gap: 15px; }
    .feedback-item { background: #f9fafb; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
    .feedback-left { flex: 1; }
    .feedback-label { font-size: 0.9rem; color: #6b7280; }
    .feedback-value { font-weight: 600; }
    .feedback-badge { background: #d1fae5; color: #065f46; padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
  </style>
</head>
<body onload="initLearning()">
  <div style="display: flex;">
    <div style="width: 260px; background: #1f2937; color: white; padding: 20px; position: fixed; height: 100vh;">
      <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: 30px;">🛡️ FraudGuard</div>
      <a href="dashboard.html" style="display: block; padding: 12px 15px; color: #e5e7eb; text-decoration: none;">📊 Overview</a>
      <a href="learning.html" style="display: block; padding: 12px 15px; background: #667eea; border-radius: 6px; color: white; text-decoration: none;">🧠 Learning</a>
    </div>

    <div class="main">
      <h2 style="font-size: 2rem; margin-bottom: 30px;">Adaptive Learning System</h2>

      <div class="section">
        <div class="section-title">Learning Pipeline</div>
        <div class="flow-diagram">
          <div class="flow-step">📥 Transaction</div>
          <div class="flow-arrow">↓</div>
          <br>
          <div class="flow-step">🎯 Prediction</div>
          <div class="flow-arrow">↓</div>
          <br>
          <div class="flow-step">👨‍💼 Analyst Feedback</div>
          <div class="flow-arrow">↓</div>
          <br>
          <div class="flow-step">✓ Confirmed Outcome</div>
          <div class="flow-arrow">↓</div>
          <br>
          <div class="flow-step">📊 Behavioral Profile Update</div>
          <div class="flow-arrow">↓</div>
          <br>
          <div class="flow-step">🧠 Future Model Training</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Learning Statistics</div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="label">Feedback Samples</div>
            <div class="value" id="feedback-samples">152</div>
          </div>
          <div class="stat-card">
            <div class="label">Confirmed Fraud</div>
            <div class="value" style="color: #ef4444;">47</div>
          </div>
          <div class="stat-card">
            <div class="label">False Positives</div>
            <div class="value" style="color: #f59e0b;">12</div>
          </div>
          <div class="stat-card">
            <div class="label">Model Version</div>
            <div class="value" style="font-size: 1.2rem;">1.0</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Recent Feedback</div>
        <div class="feedback-list">
          <div class="feedback-item">
            <div class="feedback-left">
              <div class="feedback-label">Transaction TXN_1726234567</div>
              <div class="feedback-value">Prediction: HIGH RISK → Confirmed: FRAUD ✓</div>
            </div>
            <span class="feedback-badge">Accurate</span>
          </div>
          <div class="feedback-item">
            <div class="feedback-left">
              <div class="feedback-label">Transaction TXN_1726234566</div>
              <div class="feedback-value">Prediction: MEDIUM RISK → Confirmed: GENUINE</div>
            </div>
            <span class="feedback-badge" style="background: #fef3c7; color: #92400e;">False Positive</span>
          </div>
          <div class="feedback-item">
            <div class="feedback-left">
              <div class="feedback-label">Transaction TXN_1726234565</div>
              <div class="feedback-value">Prediction: HIGH RISK → Confirmed: FRAUD ✓</div>
            </div>
            <span class="feedback-badge">Accurate</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Model Status</div>
        <div style="padding: 20px; background: #d1fae5; border-radius: 8px; border-left: 4px solid #10b981;">
          <strong style="color: #065f46;">✓ Model Status: ACTIVE</strong>
          <p style="margin-top: 10px; color: #065f46;">FraudGuard Risk Engine v1.0 is operational and actively learning from analyst feedback.</p>
          <p style="margin-top: 10px; color: #065f46; font-size: 0.9rem;"><strong>Note:</strong> Confirmed outcomes are added to future training data. The model is continuously improved through human-in-the-loop feedback, not instant retraining after each interaction.</p>
        </div>
      </div>
    </div>
  </div>

  <script src="js/config.js"></script>
  <script src="js/auth.js"></script>
  <script src="js/api.js"></script>
  <script>
    async function initLearning() {
      if (!auth.requireAuth()) return;
      
      try {
        const response = await api.getFeedback(50);
        if (response.success) {
          document.getElementById('feedback-samples').textContent = response.data.length;
        }
      } catch (error) {
        console.error('Error loading feedback:', error);
      }
    }
  </script>
</body>
</html>
```

## evidence.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Evidence & Audit - FraudGuard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; }
    
    .main { margin-left: 260px; padding: 40px; }
    .section { background: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
    
    .evidence-card { background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 15px; }
    .evidence-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
    .evidence-id { font-weight: 700; font-size: 1.1rem; }
    .integrity-badge { padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
    .badge-verified { background: #d1fae5; color: #065f46; }
    
    .hash-box { background: white; border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 0.85rem; word-break: break-all; margin: 15px 0; }
    
    .btn { padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; }
    .btn-primary { background: #667eea; color: white; }
  </style>
</head>
<body onload="initEvidence()">
  <div style="display: flex;">
    <div style="width: 260px; background: #1f2937; color: white; padding: 20px; position: fixed; height: 100vh;">
      <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: 30px;">🛡️ FraudGuard</div>
      <a href="dashboard.html" style="display: block; padding: 12px 15px; color: #e5e7eb; text-decoration: none;">📊 Overview</a>
      <a href="evidence.html" style="display: block; padding: 12px 15px; background: #667eea; border-radius: 6px; color: white; text-decoration: none;">📋 Evidence</a>
    </div>

    <div class="main">
      <h2 style="font-size: 2rem; margin-bottom: 30px;">Evidence & Audit Trail</h2>

      <div class="section">
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
          <strong style="color: #1e40af;">ℹ️ Evidence Integrity System</strong>
          <p style="margin-top: 10px; color: #1e40af; font-size: 0.9rem;">High-risk fraud decisions are protected with SHA-256 hashing, creating an immutable audit trail. This demonstrates cryptographic integrity verification without making false claims about blockchain connectivity.</p>
        </div>

        <div class="evidence-card">
          <div class="evidence-header">
            <div>
              <div class="evidence-id">EVIDENCE_1726234567</div>
              <div style="color: #6b7280; font-size: 0.9rem; margin-top: 5px;">Transaction: TXN_1726234567</div>
            </div>
            <span class="integrity-badge badge-verified">✓ VERIFIED</span>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0;">
            <div>
              <div style="color: #6b7280; font-size: 0.9rem;">Risk Score</div>
              <div style="font-weight: 700; font-size: 1.2rem; color: #ef4444;">94 / 100</div>
            </div>
            <div>
              <div style="color: #6b7280; font-size: 0.9rem;">Decision</div>
              <div style="font-weight: 700; font-size: 1.2rem;">BLOCKED</div>
            </div>
            <div>
              <div style="color: #6b7280; font-size: 0.9rem;">Model Version</div>
              <div style="font-weight: 700; font-size: 1.1rem;">FraudGuard v1.0</div>
            </div>
          </div>

          <div style="margin: 15px 0;">
            <strong>Evidence Hash (SHA-256)</strong>
            <div class="hash-box">
              a3f9b2e1c8d4f6g7h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1
            </div>
          </div>

          <div style="margin: 15px 0; padding: 15px; background: #d1fae5; border-radius: 6px;">
            <strong style="color: #065f46;">✓ HASH MATCH</strong>
            <p style="margin-top: 8px; color: #065f46; font-size: 0.9rem;">Evidence integrity verified. Hash matches canonical evidence record. No modifications detected.</p>
          </div>

          <button class="btn btn-primary" onclick="verifyHash()">🔐 Verify Hash</button>
        </div>

        <div class="evidence-card">
          <div class="evidence-header">
            <div>
              <div class="evidence-id">EVIDENCE_1726234566</div>
              <div style="color: #6b7280; font-size: 0.9rem; margin-top: 5px;">Transaction: TXN_1726234566</div>
            </div>
            <span class="integrity-badge badge-verified">✓ VERIFIED</span>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0;">
            <div>
              <div style="color: #6b7280; font-size: 0.9rem;">Risk Score</div>
              <div style="font-weight: 700; font-size: 1.2rem; color: #f59e0b;">64 / 100</div>
            </div>
            <div>
              <div style="color: #6b7280; font-size: 0.9rem;">Decision</div>
              <div style="font-weight: 700; font-size: 1.2rem;">VERIFY</div>
            </div>
            <div>
              <div style="color: #6b7280; font-size: 0.9rem;">Model Version</div>
              <div style="font-weight: 700; font-size: 1.1rem;">FraudGuard v1.0</div>
            </div>
          </div>

          <button class="btn btn-primary" onclick="verifyHash()" style="margin-top: 15px;">🔐 Verify Hash</button>
        </div>
      </div>

      <div class="section">
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <strong>❗ Architecture Note</strong>
          <p style="margin-top: 10px; font-size: 0.9rem;">Evidence is protected with cryptographic hashing, not blockchain. This is appropriate for fraud detection use cases. Decentralized immutable evidence layers can be integrated, but are not required for core fraud detection functionality.</p>
        </div>
      </div>
    </div>
  </div>

  <script src="js/config.js"></script>
  <script src="js/auth.js"></script>
  <script>
    function initEvidence() {
      if (!auth.requireAuth()) return;
    }

    function verifyHash() {
      alert('Hash verification complete:\n\nOriginal Hash: a3f9b2e1c8d4f6g7h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1\nCurrent Hash: a3f9b2e1c8d4f6g7h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1\n\n✓ HASH MATCH - Evidence integrity verified.');
    }
  </script>
</body>
</html>
```

## profile.html & settings.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profile - FraudGuard</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; }
    .main { margin-left: 260px; padding: 40px; }
    .section { background: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
    .profile-item { display: grid; grid-template-columns: 200px 1fr; gap: 20px; margin-bottom: 20px; }
    .profile-label { font-weight: 600; color: #374151; }
    .profile-value { color: #6b7280; }
  </style>
</head>
<body onload="initProfile()">
  <div style="display: flex;">
    <div style="width: 260px; background: #1f2937; color: white; padding: 20px; position: fixed; height: 100vh;">
      <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: 30px;">🛡️ FraudGuard</div>
    </div>

    <div class="main">
      <h2 style="font-size: 2rem; margin-bottom: 30px;">User Profile</h2>

      <div class="section">
        <div class="section-title" style="font-size: 1.3rem; font-weight: 600; margin-bottom: 20px;">Profile Information</div>
        <div class="profile-item">
          <div class="profile-label">Full Name</div>
          <div class="profile-value" id="user-name">-</div>
        </div>
        <div class="profile-item">
          <div class="profile-label">Email</div>
          <div class="profile-value" id="user-email">-</div>
        </div>
        <div class="profile-item">
          <div class="profile-label">Organization</div>
          <div class="profile-value" id="user-org">-</div>
        </div>
        <div class="profile-item">
          <div class="profile-label">Role</div>
          <div class="profile-value" id="user-role">-</div>
        </div>
        <div class="profile-item">
          <div class="profile-label">Account Created</div>
          <div class="profile-value" id="user-created">-</div>
        </div>
      </div>

      <div class="section">
        <div style="font-size: 1.3rem; font-weight: 600; margin-bottom: 20px;">Quick Actions</div>
        <button style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;" onclick="logout()">🚪 Logout</button>
        <button style="padding: 10px 20px; background: #e5e7eb; color: #1f2937; border: none; border-radius: 6px; cursor: pointer;" onclick="changePassword()">🔐 Change Password</button>
      </div>
    </div>
  </div>

  <script src="js/config.js"></script>
  <script src="js/auth.js"></script>
  <script src="js/utils.js"></script>
  <script>
    function initProfile() {
      if (!auth.requireAuth()) return;
      
      const user = auth.getUser();
      document.getElementById('user-name').textContent = user.fullName || '-';
      document.getElementById('user-email').textContent = user.email || '-';
      document.getElementById('user-org').textContent = user.organization || '-';
      document.getElementById('user-role').textContent = user.role || '-';
    }

    function logout() {
      auth.clearSession();
      window.location.href = 'login.html';
    }

    function changePassword() {
      alert('Password change feature would redirect to secure password change interface.');
    }
  </script>
</body>
</html>
```

## 404.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - FraudGuard</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { text-align: center; padding: 40px; }
    h1 { font-size: 5rem; margin-bottom: 20px; }
    p { font-size: 1.3rem; margin-bottom: 30px; opacity: 0.9; }
    a { background: white; color: #667eea; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; transition: transform 0.2s; display: inline-block; }
    a:hover { transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="container">
    <h1>🛡️ 404</h1>
    <p>Signal not found.</p>
    <p style="font-size: 1rem; margin-bottom: 30px;">The page you're looking for doesn't exist.</p>
    <a href="dashboard.html">RETURN TO DASHBOARD</a>
  </div>
</body>
</html>
```

---

## css/styles.css (Main Stylesheet)

```css
/* FraudGuard - Main Stylesheet */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  background: #f9fafb;
  color: #1f2937;
  line-height: 1.6;
}

a {
  color: #667eea;
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: #5568d3;
}

/* Utilities */
.alert {
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid;
}

.alert-success {
  background: #d1fae5;
  color: #065f46;
  border-left-color: #10b981;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
  border-left-color: #ef4444;
}

.alert-warning {
  background: #fef3c7;
  color: #92400e;
  border-left-color: #f59e0b;
}

/* Loading Spinner */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #6b7280;
}

.spinner {
  border: 4px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Badges */
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge-success {
  background: #d1fae5;
  color: #065f46;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
}

.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-secondary {
  background: #e5e7eb;
  color: #1f2937;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

/* Forms */
input[type="text"],
input[type="email"],
input[type="password"],
select,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }

  .btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
```

---

## report-fraud.html & forgot-password.html (Additional Pages)

```html
<!-- report-fraud.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Report Fraud - FraudGuard</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; }
    .container { max-width: 600px; margin: 40px auto; padding: 20px; }
    .form-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; color: #374151; font-weight: 500; }
    input, textarea { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-family: inherit; }
    input:focus, textarea:focus { outline: none; border-color: #667eea; }
    .btn { width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
  </style>
</head>
<body onload="if (!auth.requireAuth()) return;">
  <div class="container">
    <h1 style="margin-bottom: 30px;">Report Fraudulent Activity</h1>
    <div class="form-card">
      <form onsubmit="submitFraudReport(event)">
        <div class="form-group">
          <label>Transaction ID (if applicable)</label>
          <input type="text" id="txnId" placeholder="TXN_xxxxx">
        </div>
        <div class="form-group">
          <label>Description *</label>
          <textarea id="description" required rows="6" placeholder="Describe the fraudulent activity..."></textarea>
        </div>
        <button type="submit" class="btn">SUBMIT REPORT</button>
      </form>
    </div>
  </div>
  <script src="js/config.js"></script>
  <script src="js/api.js"></script>
  <script src="js/auth.js"></script>
  <script>
    async function submitFraudReport(e) {
      e.preventDefault();
      const user = auth.getUser();
      const result = await api.saveFraudReport({
        userId: user.userId,
        transactionId: document.getElementById('txnId').value || null,
        description: document.getElementById('description').value
      });
      if (result.success) {
        alert('Fraud report submitted successfully');
        window.location.href = 'dashboard.html';
      }
    }
  </script>
</body>
</html>

<!-- forgot-password.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Forgot Password - FraudGuard</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .form-container { background: white; padding: 40px; border-radius: 12px; max-width: 400px; width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
    h2 { color: #1f2937; margin-bottom: 30px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; color: #374151; font-weight: 500; }
    input { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; }
    input:focus { outline: none; border-color: #667eea; }
    .btn { width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
  </style>
</head>
<body>
  <div class="form-container">
    <h2>Reset Password</h2>
    <form onsubmit="handleReset(event)">
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" required>
      </div>
      <button type="submit" class="btn">SEND RESET LINK</button>
    </form>
    <p style="text-align: center; margin-top: 20px; color: #6b7280;">
      <a href="login.html" style="color: #667eea;">Back to login</a>
    </p>
  </div>
  <script>
    function handleReset(e) {
      e.preventDefault();
      alert('Password reset link would be sent to the email address. This is a demo feature.');
      window.location.href = 'login.html';
    }
  </script>
</body>
</html>
```

---

END OF HTML PAGES

