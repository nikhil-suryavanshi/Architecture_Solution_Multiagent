"use client";

import { useEffect, useState } from "react";

const STEPS = ["Reading business intent", "Deriving functional requirements", "Drafting application architecture", "Checking risks and governance", "Reconciling the package"];

export function LoadingAnalysis() {
  const [step, setStep] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setStep((current) => Math.min(current + 1, STEPS.length - 1)), 1600); return () => window.clearInterval(timer); }, []);
  return <div className="loading-card"><p className="eyebrow">Parallel analysis in progress</p><h2>Independent specialists are working on your brief.</h2><p className="muted-copy">The orchestrator runs the first wave concurrently, then synthesizes one package and sends it through governance review.</p><ol className="loading-steps">{STEPS.map((label, index) => <li key={label} className={index === step ? "active" : index < step ? "done" : ""}><span>{index < step ? "✓" : String(index + 1).padStart(2, "0")}</span>{label}</li>)}</ol></div>;
}
