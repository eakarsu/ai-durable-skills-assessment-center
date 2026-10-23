// Deterministic offline insights over this app's own assessment records.
// Pure functions: no database, network, or AI provider calls. Every result is
// labelled aiGenerated:false so it is never mistaken for a provider draft.
export type InsightRow = Record<string, unknown>;
export interface Insight {
  id: string; title: string; aiGenerated: false; summary: string;
  metrics: { label: string; value: number | boolean }[];
  sections: { title: string; detail: string }[];
  items: { label: string; detail: string }[];
}
const s = (v: unknown) => (v == null ? "" : String(v));

export function raterReliability(raters: InsightRow[]): Insight {
  const scores = raters.map((r) => Number(r.reliabilityScore)).filter((n) => Number.isFinite(n));
  const average = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100 : 0;
  const watch = raters.filter((r) => Number.isFinite(Number(r.reliabilityScore)) && Number(r.reliabilityScore) < 0.8);
  return {
    id: "rater-reliability", title: "Rater reliability watch", aiGenerated: false,
    summary: `${raters.length} rater(s); average reliability ${average}; ${watch.length} below 0.80.`,
    metrics: [
      { label: "Raters", value: raters.length },
      { label: "Average reliability", value: average },
      { label: "Below 0.80", value: watch.length },
      { label: "Has scored raters", value: scores.length > 0 },
    ],
    sections: [
      { title: "Raters below 0.80", detail: watch.length ? watch.map((r) => `${s(r.name) || s(r.id)} (${r.reliabilityScore})`).join(" · ") : "None reported." },
      { title: "How this was produced", detail: "Deterministic average over saved rater records. No AI provider was called." },
    ],
    items: watch.slice(0, 10).map((r) => ({ label: s(r.name) || s(r.id), detail: "Schedule calibration before further scoring." })),
  };
}

export function evidenceCoverage(evidence: InsightRow[], reports: InsightRow[], rubrics: InsightRow[]): Insight {
  const reported = new Set(reports.map((r) => s(r.candidate)));
  const uncovered = evidence.filter((e) => !reported.has(s(e.candidate)));
  const draftReports = reports.filter((r) => s(r.status) === "Draft");
  return {
    id: "evidence-coverage", title: "Evidence-to-report coverage", aiGenerated: false,
    summary: `${evidence.length} evidence record(s), ${reports.length} report(s), ${rubrics.length} rubric(s); ${uncovered.length} candidate(s) with evidence but no report.`,
    metrics: [
      { label: "Behavioral evidence", value: evidence.length },
      { label: "Competency reports", value: reports.length },
      { label: "Scoring rubrics", value: rubrics.length },
      { label: "Evidence without a report", value: uncovered.length },
      { label: "Draft reports", value: draftReports.length },
      { label: "Coverage complete", value: uncovered.length === 0 },
    ],
    sections: [
      { title: "Candidates with evidence but no report", detail: uncovered.length ? [...new Set(uncovered.map((e) => s(e.candidate)))].join(" · ") : "None reported." },
      { title: "How this was produced", detail: "Deterministic candidate match over saved evidence, report, and rubric records. No AI provider was called." },
    ],
    items: uncovered.slice(0, 10).map((e) => ({ label: s(e.candidate) || s(e.id), detail: "Draft a competency report from the saved evidence." })),
  };
}

export function outcomeAging(disputes: InsightRow[], badges: InsightRow[], transcripts: InsightRow[]): Insight {
  const open = disputes.filter((d) => !["Closed", "Approved"].includes(s(d.status)));
  return {
    id: "outcome-aging", title: "Disputes & outcome aging", aiGenerated: false,
    summary: `${open.length} open dispute(s), ${badges.length} badge award(s), ${transcripts.length} transcript(s) on file.`,
    metrics: [
      { label: "Disputes", value: disputes.length },
      { label: "Open disputes", value: open.length },
      { label: "Badge awards", value: badges.length },
      { label: "Employer transcripts", value: transcripts.length },
      { label: "Has open dispute", value: open.length > 0 },
    ],
    sections: [
      { title: "Open disputes", detail: open.length ? open.map((d) => s(d.reportRef) || s(d.id)).join(" · ") : "None reported." },
      { title: "How this was produced", detail: "Deterministic status count over saved dispute, badge, and transcript records. No AI provider was called." },
    ],
    items: open.slice(0, 10).map((d) => ({ label: s(d.reportRef) || s(d.id), detail: `Dispute status: ${s(d.status) || "Not provided"}. Review the linked report.` })),
  };
}

export function buildInsights(data: { raters: InsightRow[]; evidence: InsightRow[]; reports: InsightRow[]; rubrics: InsightRow[]; disputes: InsightRow[]; badges: InsightRow[]; transcripts: InsightRow[] }) {
  return {
    aiGenerated: false as const,
    source: "deterministic-fallback",
    label: "Offline deterministic insight — no AI provider call (aiGenerated: false)",
    features: [raterReliability(data.raters), evidenceCoverage(data.evidence, data.reports, data.rubrics), outcomeAging(data.disputes, data.badges, data.transcripts)],
  };
}
