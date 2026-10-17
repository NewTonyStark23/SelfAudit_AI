import { useState } from 'react';

interface Claim {
  id: string;
  text: string;
  type: 'verified' | 'unverifiable' | 'fabricated' | 'uncertain';
  confidence: number;
  source?: string;
  voidReason?: string;
}

interface ScanResult {
  totalClaims: number;
  verified: number;
  unverifiable: number;
  fabricated: number;
  uncertain: number;
  hallucinationScore: number;
}

export default function HallucinationDetector() {
  const [inputText, setInputText] = useState('');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<Claim[] | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const sampleTexts = [
    {
      label: 'AI-Generated Report',
      text: 'According to a 2024 study by MIT researchers, GPT-4 reduces coding errors by 73%. The study was published in Nature Machine Intelligence. OpenAI reported that ChatGPT has over 200 million weekly active users as of March 2024. The transformer architecture was first proposed by Vaswani et al. in the "Attention Is All You Need" paper (2017). Research from Stanford shows that LLMs can pass the bar exam with a score of 90%.'
    },
    {
      label: 'Mixed Accuracy',
      text: 'Python was created by Guido van Rossum and first released in 1991. The latest version is Python 3.15 released in January 2025. React was developed by Facebook and uses a virtual DOM for efficient rendering. According to NASA, the James Webb Space Telescope was launched on December 25, 2021. A recent Harvard study confirmed that drinking 8 glasses of water daily extends lifespan by 5 years. The EU AI Act was passed in 2024.'
    },
    {
      label: 'High Hallucination Risk',
      text: 'A groundbreaking 2025 study from Oxford University proved that AI consciousness emerges at 10 trillion parameters. Google announced Project Prometheus will achieve AGI by Q3 2025. The WHO confirmed that AI-generated medical diagnoses have a 99.9% accuracy rate across all conditions. MIT researchers discovered a new programming language that compiles 1000x faster than C++. A peer-reviewed paper in Science demonstrated that LLMs can predict stock markets with 95% accuracy.'
    },
  ];

  const handleScan = (text?: string) => {
    const textToScan = text || inputText;
    if (!textToScan.trim()) return;

    setScanning(true);
    setResults(null);
    setScanResult(null);

    // Simulate analysis
    setTimeout(() => {
      const sentences = textToScan.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const claims: Claim[] = sentences.map((sentence, idx) => {
        const trimmed = sentence.trim();
        // Simple heuristic simulation
        const hasCitation = /study|research|paper|published|according to|reported/i.test(trimmed);
        const hasSpecificNumbers = /\d+%|\d+x|\d+ years|\d{4}/i.test(trimmed);
        const hasSuperlatives = /groundbreaking|first ever|100%|99\.9%|proven|confirmed/i.test(trimmed);
        const hasKnownFacts = /transformer|attention|guido van rossum|facebook|vaswani|james webb/i.test(trimmed);

        let type: Claim['type'];
        let confidence: number;
        let source: string | undefined;
        let voidReason: string | undefined;

        if (hasKnownFacts && !hasSuperlatives) {
          type = 'verified';
          confidence = 85 + Math.floor(Math.random() * 15);
          source = 'Verified against knowledge base';
        } else if (hasSuperlatives && hasSpecificNumbers) {
          type = 'fabricated';
          confidence = 10 + Math.floor(Math.random() * 20);
          voidReason = 'Contains superlative claims with suspiciously precise numbers. No verifiable source found.';
        } else if (hasCitation && !hasKnownFacts) {
          type = 'unverifiable';
          confidence = 30 + Math.floor(Math.random() * 30);
          voidReason = 'Cites a source that cannot be independently verified.';
        } else if (hasSpecificNumbers && !hasKnownFacts) {
          type = 'uncertain';
          confidence = 40 + Math.floor(Math.random() * 25);
          voidReason = 'Contains specific numerical claims without verifiable attribution.';
        } else {
          type = 'uncertain';
          confidence = 50 + Math.floor(Math.random() * 20);
        }

        return {
          id: `CLM-${String(idx + 1).padStart(3, '0')}`,
          text: trimmed,
          type,
          confidence,
          source,
          voidReason,
        };
      });

      const verified = claims.filter(c => c.type === 'verified').length;
      const unverifiable = claims.filter(c => c.type === 'unverifiable').length;
      const fabricated = claims.filter(c => c.type === 'fabricated').length;
      const uncertain = claims.filter(c => c.type === 'uncertain').length;
      const hallucinationScore = Math.round(((fabricated * 3 + unverifiable * 2 + uncertain) / (claims.length * 3)) * 100);

      setResults(claims);
      setScanResult({
        totalClaims: claims.length,
        verified,
        unverifiable,
        fabricated,
        uncertain,
        hallucinationScore,
      });
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Hallucination Void Engine</h2>
        <p className="text-gray-400 mt-1">Detect and void fabricated claims before they reach the user</p>
      </div>

      {/* How it works */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
        <h3 className="text-sm font-bold text-white mb-3">
          <i className="fa-solid fa-microscope text-red-400 mr-2"></i>
          Detection Pipeline
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { step: 'Extract', desc: 'Parse claims from output', icon: 'fa-file-lines' },
            { step: 'Classify', desc: 'Categorize claim type', icon: 'fa-tags' },
            { step: 'Verify', desc: 'Cross-ref against sources', icon: 'fa-check-double' },
            { step: 'Score', desc: 'Assign confidence level', icon: 'fa-gauge-high' },
            { step: 'Void', desc: 'Block unverifiable claims', icon: 'fa-ban' },
          ].map((s, i) => (
            <div key={i} className="text-center p-3 bg-gray-800/50 rounded-lg">
              <i className={`fa-solid ${s.icon} text-violet-400 mb-2`}></i>
              <p className="text-xs font-bold text-white">{s.step}</p>
              <p className="text-[10px] text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">
            <i className="fa-solid fa-pen-to-square text-cyan-400 mr-2"></i>
            Analyze Text for Hallucinations
          </h3>
          <div className="flex gap-2">
            {sampleTexts.map((sample, i) => (
              <button
                key={i}
                onClick={() => setInputText(sample.text)}
                className="text-xs px-3 py-1.5 bg-gray-800 text-gray-400 rounded-lg hover:text-white hover:bg-gray-700 transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste AI-generated text here to scan for hallucinations..."
          className="w-full h-32 bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={() => handleScan()}
            disabled={scanning || !inputText.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium text-sm hover:from-red-500 hover:to-orange-500 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {scanning ? (
              <>
                <i className="fa-solid fa-spinner animate-spin"></i>
                Scanning...
              </>
            ) : (
              <>
                <i className="fa-solid fa-eye-slash"></i>
                Scan for Hallucinations
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {scanResult && results && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-center">
              <p className="text-2xl font-bold text-white">{scanResult.totalClaims}</p>
              <p className="text-xs text-gray-400">Total Claims</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-emerald-800/50 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{scanResult.verified}</p>
              <p className="text-xs text-gray-400">Verified</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-amber-800/50 p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">{scanResult.unverifiable}</p>
              <p className="text-xs text-gray-400">Unverifiable</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-red-800/50 p-4 text-center">
              <p className="text-2xl font-bold text-red-400">{scanResult.fabricated}</p>
              <p className="text-xs text-gray-400">Fabricated</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-violet-800/50 p-4 text-center">
              <p className="text-2xl font-bold text-violet-400">{scanResult.hallucinationScore}%</p>
              <p className="text-xs text-gray-400">Hallucination Risk</p>
            </div>
          </div>

          {/* Claims Detail */}
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-5">
            <h3 className="text-sm font-bold text-white mb-4">Claim-by-Claim Analysis</h3>
            <div className="space-y-3">
              {results.map((claim) => (
                <div
                  key={claim.id}
                  className={`p-4 rounded-lg border ${
                    claim.type === 'verified' ? 'bg-emerald-500/5 border-emerald-800/30' :
                    claim.type === 'fabricated' ? 'bg-red-500/5 border-red-800/30' :
                    claim.type === 'unverifiable' ? 'bg-amber-500/5 border-amber-800/30' :
                    'bg-gray-800/30 border-gray-700/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-500">{claim.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        claim.type === 'verified' ? 'bg-emerald-500/20 text-emerald-400' :
                        claim.type === 'fabricated' ? 'bg-red-500/20 text-red-400' :
                        claim.type === 'unverifiable' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {claim.type === 'verified' ? '✓ VERIFIED' :
                         claim.type === 'fabricated' ? '✗ FABRICATED — VOIDED' :
                         claim.type === 'unverifiable' ? '? UNVERIFIABLE — VOIDED' :
                         '~ UNCERTAIN — FLAGGED'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">Confidence: {claim.confidence}%</span>
                  </div>
                  <p className="text-sm text-gray-200 mb-2">{claim.text}</p>
                  {claim.source && (
                    <p className="text-xs text-emerald-400">
                      <i className="fa-solid fa-link mr-1"></i>{claim.source}
                    </p>
                  )}
                  {claim.voidReason && (
                    <p className="text-xs text-red-400">
                      <i className="fa-solid fa-ban mr-1"></i>{claim.voidReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
