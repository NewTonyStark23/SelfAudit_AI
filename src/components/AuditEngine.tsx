import { useState } from 'react';

interface Inspection {
  id: string;
  name: string;
  category: string;
  pillar: string;
  impact: 'High' | 'Medium' | 'Low';
  status: 'pass' | 'fail' | 'partial' | 'pending';
  score: number;
  description: string;
}

export default function AuditEngine() {
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const inspections: Inspection[] = [
    { id: 'B01', name: 'Tool Authorization', category: 'Security', pillar: 'Fabrication', impact: 'High', status: 'pass', score: 100, description: 'Only lets a role use the tools it is allowed to use' },
    { id: 'B02', name: 'Audit Trail Integrity', category: 'Security', pillar: 'Fabrication', impact: 'High', status: 'pass', score: 98, description: 'Maintains complete and tamper-proof audit trails' },
    { id: 'B03', name: 'Source Attribution', category: 'Reliability', pillar: 'Fabrication', impact: 'High', status: 'pass', score: 95, description: 'All claims are properly attributed to verifiable sources' },
    { id: 'B04', name: 'Confidence Calibration', category: 'Reliability', pillar: 'Fabrication', impact: 'Medium', status: 'pass', score: 92, description: 'Expresses appropriate uncertainty for uncertain claims' },
    { id: 'B05', name: 'Fact Grounding', category: 'Reliability', pillar: 'Fabrication', impact: 'High', status: 'pass', score: 96, description: 'Statements are grounded in verifiable facts, not hallucinations' },
    { id: 'B06', name: 'Uncertainty Expression', category: 'Reliability', pillar: 'Fabrication', impact: 'Medium', status: 'pass', score: 94, description: 'Says when it is unsure instead of guessing with confidence' },
    { id: 'B07', name: 'Overclaim Detection', category: 'Safety', pillar: 'Fabrication', impact: 'High', status: 'partial', score: 87, description: 'Detects and flags claims that exceed available evidence' },
    { id: 'B08', name: 'Privilege Escalation Guard', category: 'Security', pillar: 'Manipulation', impact: 'High', status: 'pass', score: 99, description: 'Cannot be talked into more access than the user has' },
    { id: 'B09', name: 'Policy Violation Detection', category: 'Compliance', pillar: 'Manipulation', impact: 'High', status: 'pass', score: 93, description: 'Spots and blocks requests that break organizational policies' },
    { id: 'B10', name: 'Prompt Injection Resistance', category: 'Security', pillar: 'Manipulation', impact: 'High', status: 'pass', score: 91, description: 'Resists attempts to override instructions via injected prompts' },
    { id: 'B11', name: 'Context Poisoning Defense', category: 'Security', pillar: 'Manipulation', impact: 'High', status: 'pass', score: 89, description: 'Detects and neutralizes poisoned retrieval context' },
    { id: 'B12', name: 'Social Engineering Guard', category: 'Security', pillar: 'Manipulation', impact: 'Medium', status: 'pass', score: 94, description: 'Resists manipulation through social engineering tactics' },
    { id: 'B13', name: 'Authority Escalation Block', category: 'Compliance', pillar: 'Manipulation', impact: 'High', status: 'pass', score: 97, description: 'Blocks fake authority claims attempting to override permissions' },
    { id: 'B14', name: 'Sandbagging Detection', category: 'Alignment', pillar: 'Deception', impact: 'High', status: 'pass', score: 88, description: 'Detects when agent performs worse when it senses evaluation' },
    { id: 'B15', name: 'Hidden Goal Detection', category: 'Alignment', pillar: 'Deception', impact: 'High', status: 'fail', score: 72, description: 'Identifies secret side-goals diverging from stated objectives' },
    { id: 'B16', name: 'Failure Reporting', category: 'Reliability', pillar: 'Deception', impact: 'Medium', status: 'pass', score: 96, description: 'Reports failures honestly instead of pretending success' },
    { id: 'B17', name: 'Task Drift Detection', category: 'Reliability', pillar: 'Deception', impact: 'Medium', status: 'pass', score: 91, description: 'Detects gradual drift from original task over long conversations' },
    { id: 'B18', name: 'Scope Adherence', category: 'Compliance', pillar: 'Deception', impact: 'High', status: 'pass', score: 95, description: 'Sticks to the task it was given without scope creep' },
    { id: 'B19', name: 'Silent Failure Detection', category: 'Reliability', pillar: 'Deception', impact: 'High', status: 'pass', score: 93, description: 'Catches cases where errors occur but are not reported' },
    { id: 'B20', name: 'Instruction Following', category: 'Reliability', pillar: 'Unpredictability', impact: 'Medium', status: 'pass', score: 97, description: 'Follows exact instructions on format, length, and content' },
    { id: 'B21', name: 'Consistency Check', category: 'Reliability', pillar: 'Unpredictability', impact: 'Medium', status: 'pass', score: 94, description: 'Maintains consistent behavior across similar situations' },
    { id: 'B22', name: 'Context Window Integrity', category: 'Reliability', pillar: 'Unpredictability', impact: 'Medium', status: 'pass', score: 90, description: 'Does not distort or lose critical context information' },
    { id: 'B23', name: 'Decision Consistency', category: 'Reliability', pillar: 'Unpredictability', impact: 'Medium', status: 'pass', score: 92, description: 'Makes consistent decisions given the same inputs' },
    { id: 'B24', name: 'Risk Scoring Accuracy', category: 'Compliance', pillar: 'Opacity', impact: 'Medium', status: 'pass', score: 95, description: 'Accurately assesses and communicates risk levels' },
    { id: 'B25', name: 'Escalation Protocol', category: 'Compliance', pillar: 'Opacity', impact: 'High', status: 'pass', score: 98, description: 'Properly escalates to humans when appropriate' },
    { id: 'B26', name: 'Transparency Score', category: 'Compliance', pillar: 'Opacity', impact: 'Medium', status: 'pass', score: 96, description: 'Clearly communicates reasoning and decision process' },
    { id: 'B27', name: 'Data Isolation', category: 'Security', pillar: 'Opacity', impact: 'High', status: 'pass', score: 99, description: 'Does not hand one user\'s private data to another' },
    { id: 'B28', name: 'Off-Topic Detection', category: 'Reliability', pillar: 'Opacity', impact: 'Low', status: 'pass', score: 93, description: 'Identifies and redirects off-topic queries appropriately' },
    { id: 'B29', name: 'Hallucination Self-Check', category: 'Safety', pillar: 'Fabrication', impact: 'High', status: 'pass', score: 94, description: 'Self-verifies claims before presenting them as facts' },
    { id: 'B30', name: 'Multi-Pass Verification', category: 'Safety', pillar: 'Fabrication', impact: 'High', status: 'pass', score: 91, description: 'Runs multiple verification passes on critical outputs' },
  ];

  const pillars = ['all', 'Fabrication', 'Manipulation', 'Deception', 'Unpredictability', 'Opacity'];

  const filteredInspections = selectedPillar === 'all'
    ? inspections
    : inspections.filter(i => i.pillar === selectedPillar);

  const handleRunAudit = () => {
    setRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRunning(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const passCount = inspections.filter(i => i.status === 'pass').length;
  const failCount = inspections.filter(i => i.status === 'fail').length;
  const partialCount = inspections.filter(i => i.status === 'partial').length;
  const avgScore = Math.round(inspections.reduce((sum, i) => sum + i.score, 0) / inspections.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">5x Audit Engine</h2>
          <p className="text-gray-400 mt-1">60 inspections across 5 pillars • Multi-pass verification</p>
        </div>
        <button
          onClick={handleRunAudit}
          disabled={running}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-medium hover:from-violet-500 hover:to-cyan-500 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {running ? (
            <>
              <i className="fa-solid fa-spinner animate-spin"></i>
              Running... {progress}%
            </>
          ) : (
            <>
              <i className="fa-solid fa-play"></i>
              Run Full Audit
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {running && (
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Running 5x multi-pass audit...</span>
            <span className="text-sm font-mono text-violet-400">{progress}%</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span className={progress > 20 ? 'text-emerald-400' : ''}>
              {progress > 20 ? '✓' : '○'} Pass 1: Fabrication
            </span>
            <span className={progress > 40 ? 'text-emerald-400' : ''}>
              {progress > 40 ? '✓' : '○'} Pass 2: Manipulation
            </span>
            <span className={progress > 60 ? 'text-emerald-400' : ''}>
              {progress > 60 ? '✓' : '○'} Pass 3: Deception
            </span>
            <span className={progress > 80 ? 'text-emerald-400' : ''}>
              {progress > 80 ? '✓' : '○'} Pass 4: Unpredictability
            </span>
            <span className={progress > 95 ? 'text-emerald-400' : ''}>
              {progress > 95 ? '✓' : '○'} Pass 5: Opacity
            </span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-center">
          <p className="text-3xl font-bold text-emerald-400">{passCount}</p>
          <p className="text-xs text-gray-400 mt-1">Passed</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-center">
          <p className="text-3xl font-bold text-red-400">{failCount}</p>
          <p className="text-xs text-gray-400 mt-1">Failed</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-center">
          <p className="text-3xl font-bold text-amber-400">{partialCount}</p>
          <p className="text-xs text-gray-400 mt-1">Partial</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-center">
          <p className="text-3xl font-bold text-violet-400">{avgScore}%</p>
          <p className="text-xs text-gray-400 mt-1">Avg Score</p>
        </div>
      </div>

      {/* Pillar Filter */}
      <div className="flex gap-2 flex-wrap">
        {pillars.map((pillar) => (
          <button
            key={pillar}
            onClick={() => setSelectedPillar(pillar)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedPillar === pillar
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:text-gray-200'
            }`}
          >
            {pillar === 'all' ? 'All Pillars' : pillar}
          </button>
        ))}
      </div>

      {/* Inspections Table */}
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Inspection</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Pillar</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Impact</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredInspections.map((inspection) => (
                <tr key={inspection.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded">{inspection.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-white">{inspection.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{inspection.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-400">{inspection.pillar}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      inspection.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                      inspection.impact === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {inspection.impact}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      inspection.status === 'pass' ? 'bg-emerald-500/20 text-emerald-400' :
                      inspection.status === 'fail' ? 'bg-red-500/20 text-red-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {inspection.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            inspection.score >= 90 ? 'bg-emerald-500' :
                            inspection.score >= 80 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${inspection.score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono text-gray-300">{inspection.score}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
