import type { ArchitectureBrief } from "./types";

export const INDUSTRIES = [
  "Enterprise technology",
  "Healthcare",
  "Financial services",
  "Insurance",
  "Retail",
  "Public sector",
  "Manufacturing",
  "Other",
] as const;

export const SCALES = [
  "Pilot / MVP",
  "Business unit",
  "Enterprise",
  "Multi-region / global",
] as const;

export const ARCHITECTURE_STYLES = [
  { id: "recommend", label: "Recommend for this intent", hint: "The orchestrator picks the best fit for this brief." },
  { id: "layered", label: "Layered / N-tier", hint: "Presentation, API, domain, and data stacked." },
  { id: "modular-monolith", label: "Modular monolith", hint: "One deployable app with hard module boundaries." },
  { id: "hexagonal", label: "Hexagonal (ports & adapters)", hint: "Domain core with UI and integration adapters." },
  { id: "microservices", label: "Microservices", hint: "Independently deployable application services." },
  { id: "event-driven", label: "Event-driven", hint: "Commands, events, and asynchronous application flow." },
  { id: "cqrs", label: "CQRS + read models", hint: "Separate write and query application paths." },
  { id: "serverless", label: "Serverless", hint: "Functions, managed data, and event triggers." },
  { id: "lcnc-runtime", label: "Low-code application runtime", hint: "Studio, catalog, and governed app host." },
] as const;

export const CONSTRAINT_OPTIONS = [
  "Cloud-first",
  "Low-code / no-code",
  "Generative AI",
  "Zero trust",
  "Data residency",
  "Cost-sensitive",
  "High availability",
  "Real-time",
  "SAP / Salesforce integration",
  "Audit & governance",
] as const;

export type SampleBrief = ArchitectureBrief & {
  id: string;
  label: string;
  summary: string;
};

export const SAMPLE_BRIEFS: SampleBrief[] = [
  {
    id: "healthcare-discovery",
    label: "Healthcare discovery",
    summary: "A governed discovery portal that helps care teams turn an outcome into a review-ready architecture.",
    title: "Healthcare Discovery Portal",
    industry: "Healthcare",
    scale: "Enterprise",
    constraints: ["Cloud-first", "Zero trust", "Data residency", "Audit & governance"],
    existingSystems: "Enterprise identity provider, EHR/FHIR gateway, data platform, API gateway, audit service.",
    architectureStyle: "recommend",
    businessContext: `We need a secure discovery portal for healthcare teams to describe a business outcome and receive a review-ready application architecture. Care operations, clinical informatics, and technology leaders should be able to collaborate without exposing patient-identifiable data in the intake.

The first release should capture intent, requirements, quality attributes, application layers, integrations, risks, and assumptions. A solution architect must review and approve the package before it can be shared as a formal PDF.

Success means reducing early solution-design cycle time from weeks to hours while preserving traceability, data residency, and an explicit human decision gate.`,
  },
  {
    id: "governed-architecture-studio",
    label: "Governed architecture studio",
    summary: "A shared intake and review space that turns business intent into approved architecture packages.",
    title: "Enterprise Architecture Decision Studio",
    industry: "Enterprise technology",
    scale: "Enterprise",
    constraints: ["Low-code / no-code", "Generative AI", "Audit & governance", "Cloud-first", "SAP / Salesforce integration"],
    existingSystems: "SAP S/4HANA, Salesforce Service Cloud, Azure AD / Entra ID, existing API gateway, ServiceNow.",
    architectureStyle: "lcnc-runtime",
    businessContext: `We need a governed architecture studio where business stakeholders and solution architects describe an outcome in natural language. The product must turn that intent into functional requirements, measurable quality attributes, and one recommended application blueprint.

Specialist agents should analyze intent, requirements, architecture, and risks in parallel. An orchestrator then reconciles their outputs, while a human architect reviews and approves the proposal before the package is marked ready for export.

The first release needs SSO-ready design, audit-friendly review evidence, integration with SAP and Salesforce, and a practical way to export an approved architecture package.`,
  },
  {
    id: "claims-modernization",
    label: "Healthcare claims",
    summary: "Regional insurer replacing a batch claims portal with a digital-first platform.",
    title: "Digital Claims Experience",
    industry: "Insurance",
    scale: "Business unit",
    constraints: ["Cloud-first", "High availability", "Audit & governance", "Data residency"],
    existingSystems: "Legacy AS/400 claims core, on-prem document store, member portal, call-center desktop.",
    architectureStyle: "layered",
    businessContext: `A regional health insurer wants to replace its paper-heavy claims intake with a digital claims experience for members, providers, and adjusters.

Members should submit claims with photos and documents from mobile. Providers need status APIs. Adjusters need a workbench with AI-assisted coding suggestions, fraud flags, and straight-through processing for low-risk claims.

Peak volume is 40k claims/day. Claims data is sensitive health information and must remain in-region. The legacy core cannot be replaced in the first wave, so the new platform must coexist and gradually strangle the AS/400 batch interface.`,
  },
  {
    id: "field-saas",
    label: "Field service SaaS",
    summary: "Multi-tenant product for technicians, dispatch, and parts across 200 customers.",
    title: "Field Service Cloud",
    industry: "Enterprise technology",
    scale: "Multi-region / global",
    constraints: ["Cloud-first", "Real-time", "Cost-sensitive", "Zero trust"],
    existingSystems: "Customer ERPs via REST/SFTP, Stripe billing, SendGrid, existing React admin.",
    architectureStyle: "modular-monolith",
    businessContext: `We are building a multi-tenant SaaS for mid-market field service companies. Dispatchers schedule jobs, technicians work from a mobile app offline, and customers track arrival windows.

Each tenant brings their own parts catalog and SLA rules. We need isolation between tenants, near-real-time location updates during active jobs, and an integration hub for QuickBooks, SAP Business One, and Salesforce. The product must launch in US and EU with data residency options.`,
  },
  {
    id: "retail-inventory",
    label: "Retail inventory",
    summary: "Omnichannel stock truth across stores, DC, and marketplace for a national retailer.",
    title: "Omnichannel Inventory Fabric",
    industry: "Retail",
    scale: "Enterprise",
    constraints: ["Real-time", "High availability", "Cost-sensitive", "Cloud-first"],
    existingSystems: "Manhattan WMS, store POS, Shopify plus marketplace feeds, IBM MQ, Snowflake.",
    architectureStyle: "cqrs",
    businessContext: `A national retailer needs a single inventory truth across 420 stores, 6 DCs, web, and marketplaces. Oversells and phantom stock are creating refunds and lost trust.

Store associates need handheld reservation. Web needs sub-second ATP. Marketplaces need scheduled feeds. The current landscape is overnight batch files plus a brittle MQ bridge, and Manhattan WMS cannot be replaced in the first wave.`,
  },
];
