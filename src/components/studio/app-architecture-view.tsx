"use client";

import type { ApplicationArchitecture } from "@/lib/types";

export function AppArchitectureView({ architecture }: { architecture: ApplicationArchitecture }) {
  return <div className="architecture-view"><div className="architecture-layers">{architecture.layers.map((layer, index) => <article className="layer-card" key={`${layer.name}-${index}`}><div className="layer-heading"><strong>{layer.name}</strong><span>{String(index + 1).padStart(2, "0")}</span></div><p>{layer.responsibilities}</p><div className="tag-row">{layer.components.map((component) => <span className="tag" key={component}>{component}</span>)}</div></article>)}</div><h4>Application modules</h4><div className="module-grid">{architecture.modules.map((module) => <article className="module-card" key={module.name}><strong>{module.name}</strong><span>{module.layer}</span><p>{module.responsibilities}</p>{module.interfaces.length ? <small>{module.interfaces.join(" · ")}</small> : null}</article>)}</div></div>;
}
