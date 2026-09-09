const formatScanResult = (scan) => {
  return {
    id: scan._id,
    type: scan.scanType,
    target: scan.target,
    status: scan.status,
    createdAt: scan.createdAt,
    completedAt: scan.completedAt,
    findings: scan.findings || [],
    metadata: scan.metadata || {}
  };
};

const formatReport = (report) => {
  return {
    id: report._id,
    title: report.title,
    target: report.target,
    status: report.status,
    visibility: report.visibility,
    findingsCount: report.findings?.length || 0,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    publishedAt: report.publishedAt
  };
};

const groupFindingsBySeverity = (findings) => {
  const grouped = {
    critical: [],
    high: [],
    medium: [],
    low: []
  };

  findings.forEach(finding => {
    const severity = finding.severity || 'low';
    if (grouped[severity]) {
      grouped[severity].push(finding);
    }
  });

  return grouped;
};

const generateSummaryStats = (scans) => {
  return {
    totalScans: scans.length,
    completedScans: scans.filter(s => s.status === 'completed').length,
    pendingScans: scans.filter(s => s.status === 'pending').length,
    failedScans: scans.filter(s => s.status === 'failed').length,
    totalFindings: scans.reduce((sum, s) => sum + (s.findings?.length || 0), 0),
    criticalFindings: scans.reduce((sum, s) => 
      sum + (s.findings?.filter(f => f.severity === 'critical')?.length || 0), 0
    )
  };
};

module.exports = {
  formatScanResult,
  formatReport,
  groupFindingsBySeverity,
  generateSummaryStats
};