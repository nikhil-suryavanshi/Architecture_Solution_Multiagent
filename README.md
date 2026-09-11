# Architecture Solution Multiagent

ArcGate AI prototype for a multi-orchestrator architecture workflow. A coordinator runs independent specialist agents in parallel, reconciles their structured results, performs a final governance review, and requires human approval before creating a formal PDF architecture package.

## Workflow

```text
Business brief
  ├─ Intent Analyst             ┐
  ├─ Requirements Engineer      │ parallel first wave
  ├─ Application Architect      │
  └─ Risk Pre-check Analyst     ┘
            ↓
      Orchestrator synthesis
            ↓
      Governance Reviewer
            ↓
       Human approval
            ↓
        PDF renderer
```

The implementation uses structured JSON internally and deterministic `pdf-lib` rendering for the user-facing artefact. It does not generate Markdown as the final package.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

If `OPENAI_API_KEY` is not configured, the application runs in deterministic mock mode so the orchestration and PDF flow can be demonstrated locally. A key entered in the form is used only for that request and is not persisted.

## API

- `POST /api/orchestrate` — starts the parallel workflow and returns the trace.
- `POST /api/runs/:runId/approve` — records the human approval in the active run store.
- `GET /api/runs/:runId/pdf` — downloads the PDF after approval.

## Current prototype boundary

The run store is in memory. Production hardening should add a database-backed run and approval record, authentication/RBAC, persistent artefact storage, provider abstraction, observability, PDF visual regression tests, and a proper job queue for long-running workflows.
