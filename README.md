# SelfAudit_AI
AI Self-Auditing Framework
 Key features include:
Dashboard: Real-time stats on audit scores, hallucination rates, task adherence, and learned failures, visualizing the 5 pillars of AI safety (Fabrication, Manipulation, Deception, Unpredictability, Opacity).
5x Audit Engine: A multi-pass verification system with 30+ inspections across all pillars, offering real-time progress tracking and detailed pass/fail scoring.
Failure Learning System: Catalogs 12 failure patterns with severity levels and mitigation strategies, creating a continuous Detect → Classify → Mitigate → Prevent loop.
Hallucination Void Engine: Analyzes text claim-by-claim using a 5-stage pipeline (Extract → Classify → Verify → Score → Void) to block fabricated outputs before delivery.
Task Adherence Monitor: Compares original tasks against AI responses to detect scope creep, missed requirements, and unrequested additions, ensuring the AI only does what was asked.
Live Audit Session: Simulates real-time streaming audits with terminal-style logs, color-coded entries, and live statistics on issues found and hallucinations voided.
