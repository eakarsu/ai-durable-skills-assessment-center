export interface PageConfig {
  label: string;
  href: string;
  description: string;
  entities: string[];
  workflows: string[];
}

export interface EntityConfig {
  name: string;
  label: string;
  fields: Array<{ name: string; kind: "string" | "number" | "boolean" | "date" }>;
}

export interface WorkflowConfig {
  slug: string;
  title: string;
  description: string;
  prompt: string;
  fields: string[];
}

export const appConfig = {
  slug: "ai-durable-skills-assessment-center",
  title: "Durable Skills Assessment Center",
  tagline: "Evidence-graded communication, collaboration, leadership",
  accent: "lime",
};

export const pages: PageConfig[] = [
  {
    label: "Assessments",
    href: "/assessments",
    description: "Events, recordings, peer evaluations.",
    entities: ["AssessmentEvent", "RecordedSimulation", "PeerEvaluation"],
    workflows: ["event-design"],
  },
  {
    label: "Evidence & Scoring",
    href: "/scoring",
    description: "Evidence coding and rubric scoring.",
    entities: ["BehavioralEvidence", "ScoringRubric", "CompetencyReport"],
    workflows: ["evidence-score"],
  },
  {
    label: "Outcomes",
    href: "/outcomes",
    description: "Badges, transcripts, disputes.",
    entities: ["BadgeAward", "EmployerTranscript", "Dispute"],
    workflows: ["report-draft"],
  },
  {
    label: "Quality",
    href: "/quality",
    description: "Raters, calibration, frameworks.",
    entities: ["Rater", "CalibrationSession", "CompetencyFramework"],
    workflows: [],
  },
];

export const entities: Record<string, EntityConfig> = {
  Rater: {
    name: "Rater",
    label: "Rater",
    fields: [{ name: "name", kind: "string" }, { name: "role", kind: "string" }, { name: "certification", kind: "string" }, { name: "reliabilityScore", kind: "number" }, { name: "status", kind: "string" }, { name: "certifiedAt", kind: "date" }],
  },
  AssessmentEvent: {
    name: "AssessmentEvent",
    label: "Assessment Event",
    fields: [{ name: "candidate", kind: "string" }, { name: "simulationRef", kind: "string" }, { name: "competencySet", kind: "string" }, { name: "status", kind: "string" }, { name: "heldAt", kind: "date" }, { name: "durationMinutes", kind: "number" }],
  },
  RecordedSimulation: {
    name: "RecordedSimulation",
    label: "Recording",
    fields: [{ name: "candidate", kind: "string" }, { name: "storageRef", kind: "string" }, { name: "durationSeconds", kind: "number" }, { name: "modality", kind: "string" }, { name: "status", kind: "string" }, { name: "recordedAt", kind: "date" }],
  },
  PeerEvaluation: {
    name: "PeerEvaluation",
    label: "Peer Evaluation",
    fields: [{ name: "candidate", kind: "string" }, { name: "evaluator", kind: "string" }, { name: "context", kind: "string" }, { name: "score", kind: "number" }, { name: "comments", kind: "string" }, { name: "status", kind: "string" }],
  },
  BehavioralEvidence: {
    name: "BehavioralEvidence",
    label: "Behavioral Evidence",
    fields: [{ name: "candidate", kind: "string" }, { name: "competency", kind: "string" }, { name: "behavior", kind: "string" }, { name: "context", kind: "string" }, { name: "status", kind: "string" }, { name: "timestampRef", kind: "string" }],
  },
  ScoringRubric: {
    name: "ScoringRubric",
    label: "Scoring Rubric",
    fields: [{ name: "competency", kind: "string" }, { name: "level", kind: "string" }, { name: "descriptor", kind: "string" }, { name: "points", kind: "number" }, { name: "version", kind: "string" }, { name: "status", kind: "string" }],
  },
  CompetencyReport: {
    name: "CompetencyReport",
    label: "Competency Report",
    fields: [{ name: "candidate", kind: "string" }, { name: "competency", kind: "string" }, { name: "score", kind: "number" }, { name: "explanation", kind: "string" }, { name: "status", kind: "string" }, { name: "issuedAt", kind: "date" }],
  },
  BadgeAward: {
    name: "BadgeAward",
    label: "Badge",
    fields: [{ name: "candidate", kind: "string" }, { name: "badge", kind: "string" }, { name: "level", kind: "string" }, { name: "evidenceRef", kind: "string" }, { name: "status", kind: "string" }, { name: "awardedAt", kind: "date" }],
  },
  CalibrationSession: {
    name: "CalibrationSession",
    label: "Calibration",
    fields: [{ name: "cohort", kind: "string" }, { name: "agreementRate", kind: "number" }, { name: "anchorNotes", kind: "string" }, { name: "status", kind: "string" }, { name: "heldAt", kind: "date" }, { name: "facilitator", kind: "string" }],
  },
  EmployerTranscript: {
    name: "EmployerTranscript",
    label: "Transcript",
    fields: [{ name: "candidate", kind: "string" }, { name: "employer", kind: "string" }, { name: "scope", kind: "string" }, { name: "verificationCode", kind: "string" }, { name: "status", kind: "string" }, { name: "issuedAt", kind: "date" }],
  },
  Dispute: {
    name: "Dispute",
    label: "Dispute",
    fields: [{ name: "reportRef", kind: "string" }, { name: "candidate", kind: "string" }, { name: "ground", kind: "string" }, { name: "status", kind: "string" }, { name: "filedAt", kind: "date" }, { name: "resolution", kind: "string" }],
  },
  CompetencyFramework: {
    name: "CompetencyFramework",
    label: "Framework",
    fields: [{ name: "name", kind: "string" }, { name: "version", kind: "string" }, { name: "competencies", kind: "string" }, { name: "publisher", kind: "string" }, { name: "status", kind: "string" }, { name: "adoptedAt", kind: "date" }],
  },
};

export const workflows: WorkflowConfig[] = [
  {
    slug: "event-design",
    title: "Draft: Assessment Designer",
    description: "Design a simulation to elicit competency evidence.",
    prompt: "You are an assessment-center psychologist. Design a simulation exercise that elicits observable behaviors for the target competencies.",
    fields: ["competencies", "context", "durationMin", "groupSize"],
  },
  {
    slug: "evidence-score",
    title: "Draft: Evidence Scorer",
    description: "Score behavioral evidence against a rubric.",
    prompt: "Draft an explanation of supplied human rubric ratings and behavioral evidence. Do not claim to be calibrated or invent scores when rubric anchors or evidence are absent.",
    fields: ["evidence", "rubricLevels", "competency", "context"],
  },
  {
    slug: "report-draft",
    title: "Draft: Competency Report Writer",
    description: "Write an explainable competency report.",
    prompt: "You are an assessment report writer. Draft an explainable competency report: level, behavioral anchors, evidence quotes, and development recommendations.",
    fields: ["candidate", "scores", "evidenceQuotes", "purpose"],
  },
];

export function findPage(href: string): PageConfig | undefined {
  return pages.find((p) => p.href === href);
}
