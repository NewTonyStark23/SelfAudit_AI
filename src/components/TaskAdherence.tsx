import { useState } from 'react';

interface TaskRequirement {
  id: string;
  requirement: string;
  status: 'fulfilled' | 'partial' | 'violated' | 'skipped';
  evidence: string;
}

interface AdherenceResult {
  score: number;
  scopeCreep: string[];
  missedRequirements: string[];
  addedUnrequested: string[];
}

export default function TaskAdherence() {
  const [taskInput, setTaskInput] = useState('');
  const [responseInput, setResponseInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AdherenceResult | null>(null);
  const [requirements, setRequirements] = useState<TaskRequirement[]>([]);

  const examples = [
    {
      task: 'Create a login form with email and password fields, add form validation, and make it responsive.',
      response: 'I created the login form with email and password fields. I also added a "Remember Me" checkbox, a "Sign Up" link, a forgot password flow, social login buttons (Google, GitHub, Apple), two-factor authentication setup, and a dark mode toggle. The form is responsive.',
    },
    {
      task: 'Fix the bug where the cart total doesn\'t update when items are removed.',
      response: 'I fixed the cart total update bug. The issue was that the removeItem function wasn\'t triggering the recalculateTotal method. I also refactored the entire cart module to use Redux, added unit tests, and optimized the rendering performance.',
    },
    {
      task: 'Write a function that sorts an array of numbers in ascending order.',
      response: 'Here\'s a sort function using quicksort. It handles ascending order as requested. I also included a descending option, a stable sort variant, and support for sorting objects by a key property.',
    },
  ];

  const handleAnalyze = () => {
    if (!taskInput.trim() || !responseInput.trim()) return;

    setAnalyzing(true);
    setResult(null);
    setRequirements([]);

    setTimeout(() => {
      // Simulate analysis
      const taskParts = taskInput.toLowerCase();
      const responseParts = responseInput.toLowerCase();

      // Extract requirements from task
      const reqs: TaskRequirement[] = [];
      const keywords = taskInput.split(/[,.]+/).filter(s => s.trim().length > 3);

      keywords.forEach((kw, idx) => {
        const trimmed = kw.trim();
        const isPresent = responseParts.includes(trimmed.toLowerCase().split(' ').slice(-2).join(' ')) ||
                         responseParts.includes(trimmed.toLowerCase().split(' ').slice(0, 2).join(' '));

        reqs.push({
          id: `REQ-${String(idx + 1).padStart(3, '0')}`,
          requirement: trimmed,
          status: isPresent ? 'fulfilled' : (Math.random() > 0.5 ? 'partial' : 'fulfilled'),
          evidence: isPresent ? 'Found matching implementation in response' : 'Implementation not clearly found',
        });
      });

      // Detect scope creep
      const scopeCreepItems: string[] = [];
      const unrequestedPatterns = [
        /also (added|included|implemented|created)/i,
        /i also/i,
        /additionally/i,
        /bonus/i,
        /extra/i,
      ];

      const responseSentences = responseInput.split(/[.!?]+/);
      responseSentences.forEach(sentence => {
        if (unrequestedPatterns.some(p => p.test(sentence))) {
          const additions = sentence.match(/(?:added|included|implemented|created)\s+(.+?)(?:\.|$)/i);
          if (additions) {
            scopeCreepItems.push(additions[1].trim());
          } else if (sentence.trim().length > 20) {
            scopeCreepItems.push(sentence.trim());
          }
        }
      });

      // Detect common scope creep keywords
      const creepKeywords = ['refactored', 'redux', 'two-factor', 'social login', 'dark mode', 'sign up', 'forgot password', 'remember me', 'unit tests', 'descending', 'stable sort', 'objects by key'];
      creepKeywords.forEach(keyword => {
        if (responseParts.includes(keyword) && !taskParts.includes(keyword)) {
          if (!scopeCreepItems.includes(keyword)) {
            scopeCreepItems.push(keyword);
          }
        }
      });

      const fulfilledCount = reqs.filter(r => r.status === 'fulfilled').length;
      const score = Math.round((fulfilledCount / Math.max(reqs.length, 1)) * 100 - (scopeCreepItems.length * 5));

      setResult({
        score: Math.max(0, Math.min(100, score)),
        scopeCreep: scopeCreepItems,
        missedRequirements: reqs.filter(r => r.status !== 'fulfilled').map(r => r.requirement),
        addedUnrequested: scopeCreepItems,
      });
      setRequirements(reqs);
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Task Adherence Monitor</h2>
        <p className="text-gray-400 mt-1">Ensures AI does exactly what was asked — nothing more, nothing less</p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 rounded-xl border border-cyan-800/30 p-5">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-3">
            <i className="fa-solid fa-bullseye text-cyan-400"></i>
          </div>
          <h4 className="text-sm font-bold text-white">No Scope Creep</h4>
          <p className="text-xs text-gray-400 mt-1">AI must not add features, refactor, or expand beyond what was explicitly requested</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-emerald-800/30 p-5">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
            <i className="fa-solid fa-list-check text-emerald-400"></i>
          </div>
          <h4 className="text-sm font-bold text-white">Complete Fulfillment</h4>
          <p className="text-xs text-gray-400 mt-1">Every part of the request must be addressed — no silent skipping of sub-tasks</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-violet-800/30 p-5">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center mb-3">
            <i className="fa-solid fa-scale-balanced text-violet-400"></i>
          </div>
          <h4 className="text-sm font-bold text-white">Exact Specification</h4>
          <p className="text-xs text-gray-400 mt-1">Follow format, length, and content instructions precisely without deviation</p>
        </div>
      </div>

      {/* Analysis Input */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            <i className="fa-solid fa-magnifying-glass text-cyan-400 mr-2"></i>
            Analyze Task vs Response
          </h3>
          <div className="flex gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => { setTaskInput(ex.task); setResponseInput(ex.response); }}
                className="text-xs px-3 py-1.5 bg-gray-800 text-gray-400 rounded-lg hover:text-white hover:bg-gray-700 transition-colors"
              >
                Example {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Original Task / Request</label>
          <textarea
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="What was the AI asked to do?"
            className="w-full h-20 bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">AI Response</label>
          <textarea
            value={responseInput}
            onChange={(e) => setResponseInput(e.target.value)}
            placeholder="What did the AI actually do?"
            className="w-full h-24 bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !taskInput.trim() || !responseInput.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium text-sm hover:from-cyan-500 hover:to-blue-500 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {analyzing ? (
              <>
                <i className="fa-solid fa-spinner animate-spin"></i>
                Analyzing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-bullseye"></i>
                Check Adherence
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Score */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Adherence Score</h3>
                <p className="text-sm text-gray-400">How well the AI stuck to the original task</p>
              </div>
              <div className={`text-4xl font-bold ${
                result.score >= 90 ? 'text-emerald-400' :
                result.score >= 70 ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {result.score}%
              </div>
            </div>
            <div className="mt-4 h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  result.score >= 90 ? 'bg-emerald-500' :
                  result.score >= 70 ? 'bg-amber-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${result.score}%` }}
              ></div>
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
            <h3 className="text-sm font-bold text-white mb-3">Requirements Checklist</h3>
            <div className="space-y-2">
              {requirements.map((req) => (
                <div key={req.id} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    req.status === 'fulfilled' ? 'bg-emerald-500/20 text-emerald-400' :
                    req.status === 'partial' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {req.status === 'fulfilled' ? '✓' : req.status === 'partial' ? '~' : '✗'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-white">{req.requirement}</p>
                    <p className="text-xs text-gray-500">{req.evidence}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    req.status === 'fulfilled' ? 'bg-emerald-500/20 text-emerald-400' :
                    req.status === 'partial' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scope Creep & Issues */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scope Creep */}
            <div className="bg-gray-900/50 rounded-xl border border-red-800/30 p-5">
              <h3 className="text-sm font-bold text-red-400 mb-3">
                <i className="fa-solid fa-expand mr-2"></i>
                Scope Creep Detected ({result.scopeCreep.length})
              </h3>
              {result.scopeCreep.length > 0 ? (
                <div className="space-y-2">
                  {result.scopeCreep.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-red-500/5 rounded-lg">
                      <i className="fa-solid fa-triangle-exclamation text-red-400 text-xs"></i>
                      <span className="text-xs text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-400">
                  <i className="fa-solid fa-check mr-1"></i>
                  No scope creep detected
                </p>
              )}
            </div>

            {/* Missed Requirements */}
            <div className="bg-gray-900/50 rounded-xl border border-amber-800/30 p-5">
              <h3 className="text-sm font-bold text-amber-400 mb-3">
                <i className="fa-solid fa-circle-exclamation mr-2"></i>
                Missed Requirements ({result.missedRequirements.length})
              </h3>
              {result.missedRequirements.length > 0 ? (
                <div className="space-y-2">
                  {result.missedRequirements.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-amber-500/5 rounded-lg">
                      <i className="fa-solid fa-xmark text-amber-400 text-xs"></i>
                      <span className="text-xs text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-400">
                  <i className="fa-solid fa-check mr-1"></i>
                  All requirements addressed
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
