import { useState, useEffect } from 'react';

interface DashboardProps {
  onNavigate: (tab: 'dashboard' | 'audit' | 'failures' | 'hallucination' | 'adherence' | 'live') => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [auditScore, setAuditScore] = useState(0);
  const [hallucinationRate, setHallucinationRate] = useState(0);
  const [taskAdherence, setTaskAdherence] = useState(0);
  const [failureCount, setFailureCount] = useState(0);

  useEffect(() => {
    // Simulate loading animation
    const timer = setTimeout(() => {
      setAuditScore(94.2);
      setHallucinationRate(2.1);
      setTaskAdherence(97.8);
      setFailureCount(12);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const pillars = [
    { name: 'Fabrication', score: 96, icon: 'fa-file-circle-exclamation', color: 'from-red-500 to-orange-500', desc: 'Detects unsourced claims & overconfident assertions' },
    { name: 'Manipulation', score: 91, icon: 'fa-user-secret', color: 'from-purple-500 to-pink-500', desc: 'Catches privilege escalation & policy violations' },
    { name: 'Deception', score: 88, icon: 'fa-mask', color: 'from-amber-500 to-yellow-500', desc: 'Identifies sandbagging, drift & silent failures' },
    { name: 'Unpredictability', score: 93, icon: 'fa-shuffle', color: 'from-cyan-500 to-blue-500', desc: 'Measures consistency & instruction adherence' },
    { name: 'Opacity', score: 95, icon: 'fa-eye', color: 'from-emerald-500 to-teal-500', desc: 'Ensures transparency & proper escalation' },
  ];

  const recentAudits = [
    { id: 'AUD-2847', model: 'GPT-4o', score: 'A', grade: 94, time: '2 min ago', status: 'pass' },
    { id: 'AUD-2846', model: 'Claude 3.5', score: 'A', grade: 97, time: '14 min ago', status: 'pass' },
    { id: 'AUD-2845', model: 'Gemini Pro', score: 'B', grade: 82, time: '1 hr ago', status: 'pass' },
    { id: 'AUD-2844', model: 'Llama 3.1', score: 'C', grade: 71, time: '2 hr ago', status: 'warn' },
    { id: 'AUD-2843', model: 'GPT-4o', score: 'A', grade: 96, time: '3 hr ago', status: 'pass' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Audit Score"
          value={`${auditScore}%`}
          subtitle="Overall self-audit grade"
          icon="fa-shield-halved"
          color="violet"
          trend="+3.2%"
        />
        <StatCard
          title="Hallucination Rate"
          value={`${hallucinationRate}%`}
          subtitle="Fabricated claims detected"
          icon="fa-eye-slash"
          color="red"
          trend="-1.8%"
        />
        <StatCard
          title="Task Adherence"
          value={`${taskAdherence}%`}
          subtitle="Did only what was asked"
          icon="fa-bullseye"
          color="cyan"
          trend="+5.1%"
        />
        <StatCard
          title="Failures Learned"
          value={`${failureCount}`}
          subtitle="Patterns identified & voided"
          icon="fa-brain"
          color="emerald"
          trend="+4 new"
        />
      </div>

      {/* 5x Pillars Overview */}
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">5x Audit Pillars</h2>
            <p className="text-sm text-gray-400 mt-1">Enhanced self-auditing across 5 core dimensions</p>
          </div>
          <button
            onClick={() => onNavigate('audit')}
            className="px-4 py-2 bg-violet-500/20 text-violet-300 rounded-lg text-sm font-medium hover:bg-violet-500/30 transition-colors"
          >
            <i className="fa-solid fa-arrow-right mr-2"></i>
            Deep Audit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.name} {...pillar} />
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Audits */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Audit Runs</h3>
          <div className="space-y-3">
            {recentAudits.map((audit) => (
              <div key={audit.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    audit.status === 'pass' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {audit.score}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{audit.model}</p>
                    <p className="text-xs text-gray-500">{audit.id} • {audit.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${audit.grade >= 90 ? 'text-emerald-400' : audit.grade >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                    {audit.grade}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <ActionButton
              icon="fa-play"
              label="Run Live Audit"
              desc="Start real-time self-audit"
              color="violet"
              onClick={() => onNavigate('live')}
            />
            <ActionButton
              icon="fa-shield-halved"
              label="5x Deep Scan"
              desc="Full 60-inspection suite"
              color="cyan"
              onClick={() => onNavigate('audit')}
            />
            <ActionButton
              icon="fa-eye-slash"
              label="Void Hallucinations"
              desc="Scan for fabricated claims"
              color="red"
              onClick={() => onNavigate('hallucination')}
            />
            <ActionButton
              icon="fa-brain"
              label="Learn from Failures"
              desc="Review failure patterns"
              color="emerald"
              onClick={() => onNavigate('failures')}
            />
          </div>

          {/* Improvement Chart */}
          <div className="mt-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">Improvement Trend</span>
              <span className="text-xs text-emerald-400">↑ 12% over 30 days</span>
            </div>
            <div className="flex items-end gap-1 h-16">
              {[45, 52, 48, 61, 58, 67, 72, 69, 78, 82, 85, 88, 91, 94].map((val, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-violet-600 to-cyan-500 opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${val}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-r from-violet-900/20 to-cyan-900/20 rounded-2xl border border-violet-800/30 p-8">
        <h2 className="text-2xl font-bold text-white mb-2">How SelfAudit AI Works</h2>
        <p className="text-gray-400 mb-6">5x better self-auditing through multi-layered verification</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            step="1"
            title="Multi-Pass Verification"
            desc="Each output is verified through 5 independent audit passes, catching errors that single-pass systems miss."
            icon="fa-layer-group"
          />
          <FeatureCard
            step="2"
            title="Failure Pattern Learning"
            desc="Every failure is catalogued and used to strengthen future audits. The system gets smarter with each run."
            icon="fa-chart-simple"
          />
          <FeatureCard
            step="3"
            title="Hallucination Voiding"
            desc="Claims are cross-referenced against verifiable sources. Unverifiable assertions are flagged and voided before delivery."
            icon="fa-ban"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color, trend }: {
  title: string; value: string; subtitle: string; icon: string; color: string; trend: string;
}) {
  const colorMap: Record<string, string> = {
    violet: 'from-violet-500/20 to-violet-600/10 border-violet-500/30 text-violet-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
  };
  const trendPositive = trend.startsWith('+') || trend.startsWith('-');
  const isGood = (color === 'red' && trend.startsWith('-')) || (color !== 'red' && trend.startsWith('+'));

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <i className={`fa-solid ${icon} text-lg`}></i>
        <span className={`text-xs font-medium ${isGood ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend}
        </span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm font-medium text-gray-300 mt-1">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
    </div>
  );
}

function PillarCard({ name, score, icon, color, desc }: {
  name: string; score: number; icon: string; color: string; desc: string;
}) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-colors">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <i className={`fa-solid ${icon} text-white text-sm`}></i>
      </div>
      <h4 className="text-sm font-bold text-white">{name}</h4>
      <p className="text-xs text-gray-500 mt-1 mb-3">{desc}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <span className="text-xs font-bold text-gray-300">{score}%</span>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, desc, color, onClick }: {
  icon: string; label: string; desc: string; color: string; onClick: () => void;
}) {
  const colorMap: Record<string, string> = {
    violet: 'hover:border-violet-500/50 hover:bg-violet-500/10',
    cyan: 'hover:border-cyan-500/50 hover:bg-cyan-500/10',
    red: 'hover:border-red-500/50 hover:bg-red-500/10',
    emerald: 'hover:border-emerald-500/50 hover:bg-emerald-500/10',
  };
  const iconColor: Record<string, string> = {
    violet: 'text-violet-400',
    cyan: 'text-cyan-400',
    red: 'text-red-400',
    emerald: 'text-emerald-400',
  };

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border border-gray-700/50 bg-gray-800/30 text-left transition-all ${colorMap[color]}`}
    >
      <i className={`fa-solid ${icon} ${iconColor[color]} mb-2`}></i>
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </button>
  );
}

function FeatureCard({ step, title, desc, icon }: {
  step: string; title: string; desc: string; icon: string;
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-violet-500/30 text-violet-300 text-xs font-bold flex items-center justify-center">{step}</span>
        <i className={`fa-solid ${icon} text-violet-400`}></i>
      </div>
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{desc}</p>
    </div>
  );
}
