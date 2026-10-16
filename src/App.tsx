import { useState } from 'react';
import Dashboard from './components/Dashboard';
import AuditEngine from './components/AuditEngine';
import FailureTracker from './components/FailureTracker';
import HallucinationDetector from './components/HallucinationDetector';
import TaskAdherence from './components/TaskAdherence';
import LiveAudit from './components/LiveAudit';

type Tab = 'dashboard' | 'audit' | 'failures' | 'hallucination' | 'adherence' | 'live';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'audit', label: '5x Audit Engine', icon: 'fa-shield-halved' },
    { id: 'failures', label: 'Failure Learning', icon: 'fa-brain' },
    { id: 'hallucination', label: 'Hallucination Void', icon: 'fa-eye-slash' },
    { id: 'adherence', label: 'Task Adherence', icon: 'fa-bullseye' },
    { id: 'live', label: 'Live Audit', icon: 'fa-play' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <i className="fa-solid fa-shield-halved text-white text-sm"></i>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  SelfAudit AI
                </h1>
                <p className="text-[10px] text-gray-500 -mt-0.5">5x Self-Auditing & Hallucination Prevention</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 hidden sm:block">v2.0 — Enhanced Audit Framework</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <i className={`fa-solid ${tab.icon} text-xs`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === 'audit' && <AuditEngine />}
        {activeTab === 'failures' && <FailureTracker />}
        {activeTab === 'hallucination' && <HallucinationDetector />}
        {activeTab === 'adherence' && <TaskAdherence />}
        {activeTab === 'live' && <LiveAudit />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              SelfAudit AI — Independent self-auditing framework for AI agents
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                All systems operational
              </span>
              <span>60 inspections • 5 pillars • Real-time learning</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
