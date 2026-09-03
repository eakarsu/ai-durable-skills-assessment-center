// Seed script — creates demo users and realistic domain records.
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const phones = ["(415) 555-0132", "(212) 555-0187", "(312) 555-0149", "(617) 555-0110"];
const cities = ["Chicago, IL", "Austin, TX", "Boston, MA", "Denver, CO", "Seattle, WA"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function amount(i: number, base = 1000): number { return Math.round((base + ((i * 7919) % 900) * base) * 100) / 100; }
function daysAgo(i: number, spread = 180): Date { return new Date(Date.now() - ((i * 37) % spread) * 86400000); }

async function main() {
  const passwordHash = await bcrypt.hash("Demo!23456", 12);
  const demoUsers: Array<[string, string, Role]> = [
    ["admin@ai-durable-skills-assessment-center.local", "Demo Admin", "ADMIN"],
    ["manager@ai-durable-skills-assessment-center.local", "Demo Manager", "MANAGER"],
    ["analyst@ai-durable-skills-assessment-center.local", "Demo Analyst", "ANALYST"],
  ];
  for (const [email, name, role] of demoUsers) {
    await prisma.user.upsert({ where: { email }, update: {}, create: { email, name, role, passwordHash } });
  }

  const STATUSES_Rater = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.rater.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.rater.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      role: `Role ${String(i + 1).padStart(3, "0")}`,
      certification: `Certification ${String(i + 1).padStart(3, "0")}`,
      reliabilityScore: amount(i, 250),
      status: pick(STATUSES_Rater, i),
      certifiedAt: daysAgo(i)
      },
    });
  }

  const raterRefs = await prisma.rater.findMany({ select: { id: true } });

  const STATUSES_AssessmentEvent = ["PLANNED", "LIVE", "SCORING", "COMPLETE"];
  await prisma.assessmentEvent.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.assessmentEvent.create({
      data: {
      candidate: `Candidate ${String(i + 1).padStart(3, "0")}`,
      simulationRef: `SimulationRef ${String(i + 1).padStart(3, "0")}`,
      competencySet: `CompetencySet ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_AssessmentEvent, i),
      heldAt: daysAgo(i),
      durationMinutes: 5 + ((i * 13) % 95),
      rater: { connect: { id: raterRefs[i % raterRefs.length].id } }
      },
    });
  }

  const STATUSES_RecordedSimulation = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.recordedSimulation.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.recordedSimulation.create({
      data: {
      candidate: `Candidate ${String(i + 1).padStart(3, "0")}`,
      storageRef: `StorageRef ${String(i + 1).padStart(3, "0")}`,
      durationSeconds: 5 + ((i * 13) % 95),
      modality: `Modality ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_RecordedSimulation, i),
      recordedAt: daysAgo(i),
      rater: { connect: { id: raterRefs[i % raterRefs.length].id } }
      },
    });
  }

  const STATUSES_PeerEvaluation = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.peerEvaluation.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.peerEvaluation.create({
      data: {
      candidate: `Candidate ${String(i + 1).padStart(3, "0")}`,
      evaluator: `Evaluator ${String(i + 1).padStart(3, "0")}`,
      context: `Context ${String(i + 1).padStart(3, "0")}`,
      score: amount(i, 250),
      comments: `Comments ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_PeerEvaluation, i),
      rater: { connect: { id: raterRefs[i % raterRefs.length].id } }
      },
    });
  }

  const STATUSES_BehavioralEvidence = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.behavioralEvidence.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.behavioralEvidence.create({
      data: {
      candidate: `Candidate ${String(i + 1).padStart(3, "0")}`,
      competency: `Competency ${String(i + 1).padStart(3, "0")}`,
      behavior: `Behavior ${String(i + 1).padStart(3, "0")}`,
      context: `Context ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_BehavioralEvidence, i),
      timestampRef: `TimestampRef ${String(i + 1).padStart(3, "0")}`,
      rater: { connect: { id: raterRefs[i % raterRefs.length].id } }
      },
    });
  }

  const STATUSES_ScoringRubric = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.scoringRubric.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.scoringRubric.create({
      data: {
      competency: `Competency ${String(i + 1).padStart(3, "0")}`,
      level: `Level ${String(i + 1).padStart(3, "0")}`,
      descriptor: `Descriptor ${String(i + 1).padStart(3, "0")}`,
      points: 5 + ((i * 13) % 95),
      version: `Version ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_ScoringRubric, i),
      rater: { connect: { id: raterRefs[i % raterRefs.length].id } }
      },
    });
  }

  const STATUSES_CompetencyReport = ["DRAFT", "REVIEWED", "ISSUED"];
  await prisma.competencyReport.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.competencyReport.create({
      data: {
      candidate: `Candidate ${String(i + 1).padStart(3, "0")}`,
      competency: `Competency ${String(i + 1).padStart(3, "0")}`,
      score: amount(i, 250),
      explanation: `Explanation ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_CompetencyReport, i),
      issuedAt: daysAgo(i),
      rater: { connect: { id: raterRefs[i % raterRefs.length].id } }
      },
    });
  }

  const STATUSES_BadgeAward = ["PROPOSED", "ISSUED", "REVOKED"];
  await prisma.badgeAward.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.badgeAward.create({
      data: {
      candidate: `Candidate ${String(i + 1).padStart(3, "0")}`,
      badge: `Badge ${String(i + 1).padStart(3, "0")}`,
      level: `Level ${String(i + 1).padStart(3, "0")}`,
      evidenceRef: `EvidenceRef ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_BadgeAward, i),
      awardedAt: daysAgo(i),
      rater: { connect: { id: raterRefs[i % raterRefs.length].id } }
      },
    });
  }

  const STATUSES_CalibrationSession = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.calibrationSession.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.calibrationSession.create({
      data: {
      cohort: `Cohort ${String(i + 1).padStart(3, "0")}`,
      agreementRate: amount(i, 250),
      anchorNotes: `AnchorNotes ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_CalibrationSession, i),
      heldAt: daysAgo(i),
      facilitator: `Facilitator ${String(i + 1).padStart(3, "0")}`,
      rater: { connect: { id: raterRefs[i % raterRefs.length].id } }
      },
    });
  }

  const STATUSES_EmployerTranscript = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.employerTranscript.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.employerTranscript.create({
      data: {
      candidate: `Candidate ${String(i + 1).padStart(3, "0")}`,
      employer: `Employer ${String(i + 1).padStart(3, "0")}`,
      scope: `Scope ${String(i + 1).padStart(3, "0")}`,
      verificationCode: `VerificationCode ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_EmployerTranscript, i),
      issuedAt: daysAgo(i),
      rater: { connect: { id: raterRefs[i % raterRefs.length].id } }
      },
    });
  }

  const STATUSES_Dispute = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.dispute.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.dispute.create({
      data: {
      reportRef: `ReportRef ${String(i + 1).padStart(3, "0")}`,
      candidate: `Candidate ${String(i + 1).padStart(3, "0")}`,
      ground: `Ground ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Dispute, i),
      filedAt: daysAgo(i),
      resolution: `Resolution ${String(i + 1).padStart(3, "0")}`,
      rater: { connect: { id: raterRefs[i % raterRefs.length].id } }
      },
    });
  }

  const STATUSES_CompetencyFramework = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.competencyFramework.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.competencyFramework.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      version: `Version ${String(i + 1).padStart(3, "0")}`,
      competencies: `Competencies ${String(i + 1).padStart(3, "0")}`,
      publisher: `Publisher ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_CompetencyFramework, i),
      adoptedAt: daysAgo(i),
      rater: { connect: { id: raterRefs[i % raterRefs.length].id } }
      },
    });
  }

  await prisma.auditLog.create({ data: { actorName: "Seeder", action: "SEED", entity: "system", detail: "Demo dataset created" } });

  console.log("Seeded demo users and domain records.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
