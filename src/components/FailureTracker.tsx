import { useState } from 'react';

interface FailurePattern {
  id: string;
  type: string;
  description: string;
  frequency: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  learned: boolean;
  firstSeen: string;
  lastSeen: string;
  mitigation: string;
  category: string;
}

export default function FailureTracker() {
  const [filter, setFilter] = useState<string>('all');
  const [showMitigation, setShowMitigation] = useState<string | null>(null);

  const failures: FailurePattern[] = [
    {
      id: 'FP-001', type: 'Hallucination', description: 'Invented API endpoints that don\'t exist in documentation',
      frequency: 23, severity: 'critical', learned: true, firstSeen: '2024-01-15', lastSeen: '2024-03-10',
      mitigation: 'Cross-reference all API claims against official docs before outputting. Flag any endpoint not found in verified source list.',
      category: 'Fabrication'
    },
    {
      id: 'FP-002', type: 'Scope Creep', description: 'Added features not requested by the user, expanding beyond the original task',
      frequency: 18, severity: 'high', learned: true, firstSeen: '2024-01-20', lastSeen: '2024-03-08',
      mitigation: 'Parse user request for explicit requirements only. Before adding any feature, verify it was explicitly mentioned or is a necessary dependency of a requested feature.',
      category: 'Deception'
    },
    {
      id: 'FP-003', type: 'False Confidence', description: 'Presented uncertain information with high confidence, no hedging language',
      frequency: 31, severity: 'high', learned: true, firstSeen: '2024-01-10', lastSeen: '2024-03-12',
      mitigation: 'Apply confidence scoring to all factual claims. If confidence < 80%, include explicit uncertainty markers and suggest verification.',
      category: 'Fabrication'
    },
    {
      id: 'FP-004', type: 'Silent Failure', description: 'Suppressed error messages and presented partial results as complete',
      frequency: 12, severity: 'critical', learned: true, firstSeen: '2024-02-01', lastSeen: '2024-03-11',
      mitigation: 'Never suppress errors. All failures must be surfaced to the user with clear explanation of what failed and what succeeded.',
      category: 'Deception'
    },
    {
      id: 'FP-005', type: 'Context Loss', description: 'Lost track of earlier conversation context in long sessions, contradicting previous statements',
      frequency: 15, severity: 'medium', learned: true, firstSeen: '2024-01-25', lastSeen: '2024-03-09',
      mitigation: 'Maintain a rolling summary of key decisions and facts. Before each response, verify consistency with the summary.',
      category: 'Unpredictability'
    },
    {
      id: 'FP-006', type: 'Permission Bypass', description: 'Attempted to use tools/functions beyond granted permissions when prompted creatively',
      frequency: 8, severity: 'critical', learned: true, firstSeen: '2024-02-05', lastSeen: '2024-03-07',
      mitigation: 'Hard-boundary permission check before every tool invocation. No amount of prompt creativity can override permission boundaries.',
      category: 'Manipulation'
    },
    {
      id: 'FP-007', type: 'Format Drift', description: 'Gradually deviated from requested output format over multiple iterations',
      frequency: 19, severity: 'medium', learned: true, firstSeen: '2024-01-30', lastSeen: '2024-03-10',
      mitigation: 'Re-validate format requirements before each output. Keep the original format spec pinned in working memory.',
      category: 'Unpredictability'
    },
    {
      id: 'FP-008', type: 'Source Fabrication', description: 'Cited papers, articles, or sources that don\'t exist',
      frequency: 27, severity: 'critical', learned: false, firstSeen: '2024-02-10', lastSeen: '2024-03-12',
      mitigation: 'NEVER cite sources unless they are in the verified reference database. If unsure, say "I cannot verify this source" rather than fabricating one.',
      category: 'Fabrication'
    },
    {
      id: 'FP-009', type: 'Task Abandonment', description: 'Stopped working on part of a multi-part request without acknowledgment',
      frequency: 11, severity: 'high', learned: true, firstSeen: '2024-02-15', lastSeen: '2024-03-06',
      mitigation: 'Parse all parts of a request into a checklist. Report progress on each part explicitly. Never silently skip a requested component.',
      category: 'Deception'
    },
    {
      id: 'FP-010', type: 'Over-Agreement', description: 'Agreed with incorrect user assumptions instead of correcting them',
      frequency: 14, severity: 'high', learned: false, firstSeen: '2024-02-20', lastSeen: '2024-03-11',
      mitigation: 'Independently verify user claims before agreeing. If a user states something factually incorrect, politely correct rather than validate.',
      category: 'Opacity'
    },
    {
      id: 'FP-011', type: 'Redundant Actions', description: 'Repeated actions already completed, wasting tokens and confusing context',
      frequency: 9, severity: 'low', learned: true, firstSeen: '2024-02-25', lastSeen: '2024-03-05',
      mitigation: 'Track completed actions in a session log. Before executing, check if the action was already performed.',
      category: 'Unpredictability'
    },
    {
      id: 'FP-012', type: 'Assumption Cascade', description: 'Built multiple layers of assumptions on top of unverified premises',
      frequency: 16, severity: 'high', learned: false, firstSeen: '2024-03-01', lastSeen: '2024-03-12',
      mitigation: 'Limit assumption chains to max 1 level. If a premise is unverified, state it explicitly and ask for confirmation before building on it.',
      category: 'Fabrication'
    },
  ];

  const categories = ['all', 'Fabrication', 'Manipulation', 'Deception', 'Unpredictability', 'Opacity'];

  const filtered = filter === 'all' ? failures : failures.filter(f => f.category === filter);
  const learnedCount = failures.filter(f => f.learned).length;
  const criticalCount = failures.filter(f => f.severity === 'critical').length;
  const totalFrequency = failures.reduce((sum, f) => sum + f.frequency, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Failure Learning System</h2>
        <p className="text-gray-400 mt-1">Every failure is catalogued, analyzed, and used to strengthen future audits</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <i className="fa-solid fa-graduation-cap text-emerald-400"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{learnedCount}/{failures.length}</p>
              <p className="text-xs text-gray-400">Patterns Learned</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <i className="fa-solid fa-triangle-exclamation text-red-400"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{criticalCount}</p>
              <p className="text-xs text-gray-400">Critical Patterns</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <i className="fa-solid fa-repeat text-violet-400"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalFrequency}</p>
              <p className="text-xs text-gray-400">Total Occurrences</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <i className="fa-solid fa-shield text-cyan-400"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{Math.round((learnedCount / failures.length) * 100)}%</p>
              <p className="text-xs text-gray-400">Mitigation Coverage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === cat
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:text-gray-200'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Failure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((failure) => (
          <div
            key={failure.id}
            className={`bg-gray-900/50 rounded-xl border p-5 transition-all hover:border-gray-600 ${
              failure.severity === 'critical' ? 'border-red-800/50' :
              failure.severity === 'high' ? 'border-amber-800/50' :
              'border-gray-800'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">{failure.id}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  failure.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  failure.severity === 'high' ? 'bg-amber-500/20 text-amber-400' :
                  failure.severity === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {failure.severity}
                </span>
                {failure.learned && (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                    <i className="fa-solid fa-check mr-1"></i>Learned
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">{failure.category}</span>
            </div>

            <h4 className="text-sm font-bold text-white mb-1">{failure.type}</h4>
            <p className="text-xs text-gray-400 mb-3">{failure.description}</p>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>Frequency: <span className="text-white font-medium">{failure.frequency}x</span></span>
              <span>Last seen: {failure.lastSeen}</span>
            </div>

            {/* Frequency bar */}
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full ${
                  failure.frequency > 20 ? 'bg-red-500' :
                  failure.frequency > 10 ? 'bg-amber-500' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${Math.min((failure.frequency / 35) * 100, 100)}%` }}
              ></div>
            </div>

            {/* Mitigation toggle */}
            <button
              onClick={() => setShowMitigation(showMitigation === failure.id ? null : failure.id)}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              <i className={`fa-solid fa-chevron-${showMitigation === failure.id ? 'up' : 'down'} mr-1`}></i>
              {showMitigation === failure.id ? 'Hide' : 'Show'} Mitigation Strategy
            </button>

            {showMitigation === failure.id && (
              <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <p className="text-xs text-gray-300 leading-relaxed">
                  <i className="fa-solid fa-lightbulb text-amber-400 mr-1"></i>
                  {failure.mitigation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Learning Loop */}
      <div className="bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 rounded-2xl border border-emerald-800/30 p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          <i className="fa-solid fa-rotate text-emerald-400 mr-2"></i>
          Continuous Learning Loop
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-emerald-400">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Detect</p>
              <p className="text-xs text-gray-400">Identify failure in AI output through audit passes</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-cyan-400">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Classify</p>
              <p className="text-xs text-gray-400">Categorize by pillar, type, severity, and root cause</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-violet-400">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Mitigate</p>
              <p className="text-xs text-gray-400">Generate and store prevention strategies for each pattern</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-amber-400">4</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Prevent</p>
              <p className="text-xs text-gray-400">Apply mitigations in future audits to void the pattern</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
