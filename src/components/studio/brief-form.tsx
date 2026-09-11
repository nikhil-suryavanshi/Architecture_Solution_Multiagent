"use client";

import { ARCHITECTURE_STYLES, CONSTRAINT_OPTIONS, INDUSTRIES, SAMPLE_BRIEFS, SCALES } from "@/lib/samples";
import type { ArchitectureBrief } from "@/lib/types";

type BriefFormProps = {
  brief: ArchitectureBrief;
  openaiApiKey: string;
  onOpenAIApiKeyChange: (value: string) => void;
  serverHasKey: boolean;
  onChange: (brief: ArchitectureBrief) => void;
  onSubmit: () => void;
  loading: boolean;
};

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" className={`choice-chip${selected ? " selected" : ""}`} onClick={onClick} aria-pressed={selected}>{children}</button>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="brief-section"><h3>{title}</h3>{children}</section>;
}

export function BriefForm({ brief, openaiApiKey, onOpenAIApiKeyChange, serverHasKey, onChange, onSubmit, loading }: BriefFormProps) {
  const patch = (partial: Partial<ArchitectureBrief>) => onChange({ ...brief, ...partial });
  const toggleConstraint = (constraint: string) => patch({ constraints: brief.constraints.includes(constraint) ? brief.constraints.filter((item) => item !== constraint) : [...brief.constraints, constraint] });

  return <form className="brief-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
    <section className="brief-section first-section">
      <div><h3>Business context</h3><p>Describe the outcome, audience, and first-release success criteria.</p></div>
      <label>Working title<input value={brief.title ?? ""} onChange={(event) => patch({ title: event.target.value })} placeholder="Digital Claims Experience" /></label>
      <label>Business intent<textarea rows={8} value={brief.businessContext} onChange={(event) => patch({ businessContext: event.target.value })} placeholder="For whom are we building this, what should change, and how will we know the first release worked?" /></label>
      <div><span className="field-label">Examples</span><div className="chip-row">{SAMPLE_BRIEFS.map((sample) => <Chip key={sample.id} selected={brief.businessContext === sample.businessContext} onClick={() => onChange({ title: sample.title, businessContext: sample.businessContext, industry: sample.industry, constraints: sample.constraints, scale: sample.scale, existingSystems: sample.existingSystems, architectureStyle: sample.architectureStyle })}>{sample.label}</Chip>)}</div></div>
    </section>

    <Section title="Industry & scale">
      <div><span className="field-label">Industry</span><div className="chip-row">{INDUSTRIES.map((industry) => <Chip key={industry} selected={brief.industry === industry} onClick={() => patch({ industry })}>{industry}</Chip>)}</div></div>
      <div><span className="field-label">Scale</span><div className="chip-row">{SCALES.map((scale) => <Chip key={scale} selected={brief.scale === scale} onClick={() => patch({ scale })}>{scale}</Chip>)}</div></div>
    </Section>

    <Section title="Architecture approach">
      <p className="section-help">Choose a preferred structure, or let the orchestrator recommend one.</p>
      <div className="chip-row">{ARCHITECTURE_STYLES.map((style) => <Chip key={style.id} selected={brief.architectureStyle === style.id} onClick={() => patch({ architectureStyle: style.id })}>{style.label}</Chip>)}</div>
      <p className="style-hint">{ARCHITECTURE_STYLES.find((style) => style.id === brief.architectureStyle)?.hint}</p>
    </Section>

    <Section title="Constraints"><div className="chip-row">{CONSTRAINT_OPTIONS.map((constraint) => <Chip key={constraint} selected={brief.constraints.includes(constraint)} onClick={() => toggleConstraint(constraint)}>{constraint}</Chip>)}</div></Section>

    <Section title="Existing systems"><input value={brief.existingSystems} onChange={(event) => patch({ existingSystems: event.target.value })} placeholder="SAP, Salesforce, EHR/FHIR gateway, identity provider…" /></Section>

    <section className="api-key-panel">
      <label>OpenAI API key<input type="password" autoComplete="off" value={openaiApiKey} onChange={(event) => onOpenAIApiKeyChange(event.target.value)} placeholder={serverHasKey ? "Using OPENAI_API_KEY from the server" : "Paste an OpenAI API key"} /></label>
      <p>Used only for the request and stored in this browser. Leave blank to use the server key or run the deterministic mock.</p>
      <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">Get a key from OpenAI Platform ↗</a>
    </section>

    <button className="primary submit-button" type="submit" disabled={loading}>{loading ? "Running specialist agents…" : "Run multi-orchestrator →"}</button>
  </form>;
}
