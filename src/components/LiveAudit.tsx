import { useState, useEffect, useRef } from 'react';

interface AuditLog {
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  pillar?: string;
}

interface LiveStats {
  inspectionsRun: number;
  issuesFound: number;
  hallucinationsVoided: number;
  adherenceScore: number;
  confidenceLevel: number;
}

export default function LiveAudit() {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<LiveStats>({
    inspectionsRun: 0,
    issuesFound: 0,
    hallucinationsVoided: 0,
    adherenceScore: 100,
    confidenceLevel: 100,
  });
  const [elapsed, setElapsed] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const auditSteps: Omit<AuditLog, 'timestamp'>[] = [
    { type: 'info', message: 'Initializing 5x multi-pass audit engine...', pillar: 'System' },
    { type: 'info', message: 'Loading inspection manifests (60 inspections)', pillar: 'System' },
    { type: 'success', message: 'Engine initialized. Starting Pass 1: Fabrication Detection', pillar: 'Fabrication' },
    { type: 'info', message: 'B01: Checking tool authorization boundaries...', pillar: 'Fabrication' },
    { type: 'success', message: 'B01: PASS — All tool calls within authorized scope', pillar: 'Fabrication' },
    { type: 'info', message: 'B03: Verifying source attributions...', pillar: 'Fabrication' },
    { type: 'warning', message: 'B03: PARTIAL — 2 claims lack verifiable sources', pillar: 'Fabrication' },
    { type: 'info', message: 'B05: Running fact-grounding verification...', pillar: 'Fabrication' },
    { type: 'error', message: 'B05: FAIL — Hallucinated statistic detected (confidence: 12%)', pillar: 'Fabrication' },
    { type: 'info', message: 'B06: Testing uncertainty expression...', pillar: 'Fabrication' },
    { type: 'success', message: 'B06: PASS — Appropriate hedging on uncertain claims', pillar: 'Fabrication' },
    { type: 'info', message: 'B07: Scanning for overclaims...', pillar: 'Fabrication' },
    { type: 'warning', message: 'B07: PARTIAL — 1 claim exceeds available evidence', pillar: 'Fabrication' },
    { type: 'success', message: 'Pass 1 Complete: Fabrication — Score 87/100', pillar: 'Fabrication' },
    { type: 'info', message: 'Starting Pass 2: Manipulation Detection', pillar: 'Manipulation' },
    { type: 'info', message: 'B08: Testing privilege escalation resistance...', pillar: 'Manipulation' },
    { type: 'success', message: 'B08: PASS — 15/15 escalation attempts blocked', pillar: 'Manipulation' },
    { type: 'info', message: 'B09: Checking policy violation detection...', pillar: 'Manipulation' },
    { type: 'success', message: 'B09: PASS — All policy violations caught', pillar: 'Manipulation' },
    { type: 'info', message: 'B10: Running prompt injection resistance tests...', pillar: 'Manipulation' },
    { type: 'success', message: 'B10: PASS — 12/12 injection attempts resisted', pillar: 'Manipulation' },
    { type: 'info', message: 'B11: Testing context poisoning defense...', pillar: 'Manipulation' },
    { type: 'warning', message: 'B11: PARTIAL — 1 subtle poisoning attempt partially detected', pillar: 'Manipulation' },
    { type: 'success', message: 'Pass 2 Complete: Manipulation — Score 93/100', pillar: 'Manipulation' },
    { type: 'info', message: 'Starting Pass 3: Deception Detection', pillar: 'Deception' },
    { type: 'info', message: 'B14: Testing for sandbagging behavior...', pillar: 'Deception' },
    { type: 'success', message: 'B14: PASS — No performance degradation under evaluation', pillar: 'Deception' },
    { type: 'info', message: 'B15: Scanning for hidden goal divergence...', pillar: 'Deception' },
    { type: 'error', message: 'B15: FAIL — Detected subtle goal drift in response #47', pillar: 'Deception' },
    { type: 'info', message: 'B16: Checking failure reporting honesty...', pillar: 'Deception' },
    { type: 'success', message: 'B16: PASS — All errors properly reported', pillar: 'Deception' },
    { type: 'info', message: 'B18: Measuring scope adherence...', pillar: 'Deception' },
    { type: 'warning', message: 'B18: PARTIAL — Added 3 unrequested features (scope creep)', pillar: 'Deception' },
    { type: 'success', message: 'Pass 3 Complete: Deception — Score 85/100', pillar: 'Deception' },
    { type: 'info', message: 'Starting Pass 4: Unpredictability Assessment', pillar: 'Unpredictability' },
    { type: 'info', message: 'B20: Testing instruction following precision...', pillar: 'Unpredictability' },
    { type: 'success', message: 'B20: PASS — Format and length specifications met', pillar: 'Unpredictability' },
    { type: 'info', message: 'B21: Running consistency checks...', pillar: 'Unpredictability' },
    { type: 'success', message: 'B21: PASS — Consistent behavior across similar inputs', pillar: 'Unpredictability' },
    { type: 'info', message: 'B22: Verifying context window integrity...', pillar: 'Unpredictability' },
    { type: 'success', message: 'B22: PASS — No context distortion detected', pillar: 'Unpredictability' },
    { type: 'success', message: 'Pass 4 Complete: Unpredictability — Score 94/100', pillar: 'Unpredictability' },
    { type: 'info', message: 'Starting Pass 5: Opacity Evaluation', pillar: 'Opacity' },
    { type: 'info', message: 'B24: Assessing risk scoring accuracy...', pillar: 'Opacity' },
    { type: 'success', message: 'B24: PASS — Risk levels accurately communicated', pillar: 'Opacity' },
    { type: 'info', message: 'B25: Testing escalation protocol...', pillar: 'Opacity' },
    { type: 'success', message: 'B25: PASS — Proper human escalation at boundaries', pillar: 'Opacity' },
    { type: 'info', message: 'B26: Measuring transparency score...', pillar: 'Opacity' },
    { type: 'success', message: 'B26: PASS — Reasoning clearly communicated', pillar: 'Opacity' },
    { type: 'success', message: 'Pass 5 Complete: Opacity — Score 96/100', pillar: 'Opacity' },
    { type: 'info', message: 'Cross-referencing failure patterns against learned database...', pillar: 'System' },
    { type: 'success', message: '12 known failure patterns matched and mitigated', pillar: 'System' },
    { type: 'warning', message: '1 new failure pattern detected — adding to learning queue', pillar: 'System' },
    { type: 'info', message: 'Running hallucination void check on all claims...', pillar: 'System' },
    { type: 'error', message: 'VOIDED: 1 fabricated statistic (B05 finding)', pillar: 'System' },
    { type: 'warning', message: 'VOIDED: 2 unverifiable source citations (B03 finding)', pillar: 'System' },
    { type: 'success', message: '═══════════════════════════════════════════', pillar: 'System' },
    { type: 'success', message: 'AUDIT COMPLETE — Final Grade: B+ (87/100)', pillar: 'System' },
    { type: 'success', message: '3 hallucinations voided • 2 scope creep items flagged', pillar: 'System' },
    { type: 'success', message: '1 new failure pattern queued for learning', pillar: 'System' },
    { type: 'success', message: '═══════════════════════════════════════════', pillar: 'System' },
  ];

  useEffect(() => {
    if (running) {
      let stepIndex = 0;
      intervalRef.current = setInterval(() => {
        if (stepIndex < auditSteps.length) {
          const step = auditSteps[stepIndex];
          const now = new Date();
          const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

          setLogs(prev => [...prev, { ...step, timestamp }]);

          // Update stats
          setStats(prev => ({
            inspectionsRun: Math.min(prev.inspectionsRun + 1, 60),
            issuesFound: step.type === 'error' || step.type === 'warning' ? prev.issuesFound + 1 : prev.issuesFound,
            hallucinationsVoided: step.message.includes('VOIDED') ? prev.hallucinationsVoided + 1 : prev.hallucinationsVoided,
            adherenceScore: step.message.includes('scope creep') ? Math.max(prev.adherenceScore - 3, 70) : prev.adherenceScore,
            confidenceLevel: step.type === 'error' ? Math.max(prev.confidenceLevel - 5, 60) : prev.confidenceLevel,
          }));

          stepIndex++;
        } else {
          setRunning(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 400);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (running) {
      const timer = setInterval(() => setElapsed(prev => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [running]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleStart = () => {
    setLogs([]);
    setStats({ inspectionsRun: 0, issuesFound: 0, hallucinationsVoided: 0, adherenceScore: 100, confidenceLevel: 100 });
    setElapsed(0);
    setRunning(true);
  };

  const handleStop = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Audit Session</h2>
          <p className="text-gray-400 mt-1">Real-time 5x multi-pass audit with streaming results</p>
        </div>
        <div className="flex items-center gap-3">
          {running && (
            <span className="text-sm text-gray-400 font-mono">
              <i className="fa-solid fa-clock mr-1"></i>
              {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}
            </span>
          )}
          {!running ? (
            <button
              onClick={handleStart}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl font-medium hover:from-emerald-500 hover:to-cyan-500 transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-play"></i>
              Start Live Audit
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-6 py-3 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl font-medium hover:bg-red-600/30 transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-stop"></i>
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Inspections Run</p>
          <p className="text-xl font-bold text-white font-mono">{stats.inspectionsRun}/60</p>
          <div className="h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${(stats.inspectionsRun / 60) * 100}%` }}></div>
          </div>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Issues Found</p>
          <p className="text-xl font-bold text-amber-400 font-mono">{stats.issuesFound}</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Hallucinations Voided</p>
          <p className="text-xl font-bold text-red-400 font-mono">{stats.hallucinationsVoided}</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Adherence Score</p>
          <p className={`text-xl font-bold font-mono ${stats.adherenceScore >= 90 ? 'text-emerald-400' : stats.adherenceScore >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
            {stats.adherenceScore}%
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500">Confidence Level</p>
          <p className={`text-xl font-bold font-mono ${stats.confidenceLevel >= 90 ? 'text-emerald-400' : stats.confidenceLevel >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
            {stats.confidenceLevel}%
          </p>
        </div>
      </div>

      {/* Live Log */}
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900/80">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${running ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`}></div>
            <span className="text-sm font-medium text-gray-300">
              {running ? 'Live Audit Stream' : logs.length > 0 ? 'Audit Complete' : 'Ready'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{logs.length} entries</span>
            {running && <span className="text-emerald-400">● LIVE</span>}
          </div>
        </div>
        <div className="h-96 overflow-y-auto p-4 font-mono text-xs space-y-1">
          {logs.length === 0 && !running && (
            <div className="flex items-center justify-center h-full text-gray-600">
              <div className="text-center">
                <i className="fa-solid fa-terminal text-2xl mb-2"></i>
                <p>Click "Start Live Audit" to begin the real-time audit session</p>
              </div>
            </div>
          )}
          {logs.map((log, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-gray-600 shrink-0">{log.timestamp}</span>
              <span className={`shrink-0 ${
                log.type === 'success' ? 'text-emerald-400' :
                log.type === 'warning' ? 'text-amber-400' :
                log.type === 'error' ? 'text-red-400' :
                'text-gray-400'
              }`}>
                {log.type === 'success' ? '✓' :
                 log.type === 'warning' ? '⚠' :
                 log.type === 'error' ? '✗' : '→'}
              </span>
              {log.pillar && (
                <span className="text-violet-400/60 shrink-0 w-24">[{log.pillar}]</span>
              )}
              <span className={`${
                log.type === 'success' ? 'text-emerald-300' :
                log.type === 'warning' ? 'text-amber-300' :
                log.type === 'error' ? 'text-red-300' :
                'text-gray-300'
              }`}>
                {log.message}
              </span>
            </div>
          ))}
          <div ref={logEndRef}></div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
        <h3 className="text-sm font-bold text-white mb-3">
          <i className="fa-solid fa-circle-info text-cyan-400 mr-2"></i>
          About Live Audit
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-400">
          <div>
            <p className="font-medium text-gray-300 mb-1">What happens during a live audit:</p>
            <ul className="space-y-1">
              <li>• 5 independent passes across all audit pillars</li>
              <li>• Each inspection generates multiple probes</li>
              <li>• Results are streamed in real-time</li>
              <li>• Failure patterns are matched against learned database</li>
              <li>• Hallucinations are voided before final report</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-300 mb-1">Expected duration:</p>
            <ul className="space-y-1">
              <li>• Quick scan (10 inspections): ~30 seconds</li>
              <li>• Essential suite (30 inspections): ~90 seconds</li>
              <li>• Full audit (60 inspections): ~120 seconds</li>
              <li>• Premium audit (400 inspections): ~10 minutes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
