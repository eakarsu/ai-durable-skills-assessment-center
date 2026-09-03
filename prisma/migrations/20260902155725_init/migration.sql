-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'ANALYST');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ANALYST',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "actorName" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rater" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "certification" TEXT NOT NULL,
    "reliabilityScore" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "certifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rater_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentEvent" (
    "id" TEXT NOT NULL,
    "candidate" TEXT NOT NULL,
    "simulationRef" TEXT NOT NULL,
    "competencySet" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "heldAt" TIMESTAMP(3),
    "durationMinutes" INTEGER NOT NULL,
    "raterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordedSimulation" (
    "id" TEXT NOT NULL,
    "candidate" TEXT NOT NULL,
    "storageRef" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "modality" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3),
    "raterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecordedSimulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeerEvaluation" (
    "id" TEXT NOT NULL,
    "candidate" TEXT NOT NULL,
    "evaluator" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "comments" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "raterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeerEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BehavioralEvidence" (
    "id" TEXT NOT NULL,
    "candidate" TEXT NOT NULL,
    "competency" TEXT NOT NULL,
    "behavior" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "timestampRef" TEXT NOT NULL,
    "raterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BehavioralEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoringRubric" (
    "id" TEXT NOT NULL,
    "competency" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "descriptor" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "raterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScoringRubric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetencyReport" (
    "id" TEXT NOT NULL,
    "candidate" TEXT NOT NULL,
    "competency" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "explanation" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3),
    "raterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetencyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BadgeAward" (
    "id" TEXT NOT NULL,
    "candidate" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "evidenceRef" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "awardedAt" TIMESTAMP(3),
    "raterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BadgeAward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalibrationSession" (
    "id" TEXT NOT NULL,
    "cohort" TEXT NOT NULL,
    "agreementRate" DOUBLE PRECISION NOT NULL,
    "anchorNotes" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "heldAt" TIMESTAMP(3),
    "facilitator" TEXT NOT NULL,
    "raterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalibrationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployerTranscript" (
    "id" TEXT NOT NULL,
    "candidate" TEXT NOT NULL,
    "employer" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3),
    "raterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployerTranscript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "reportRef" TEXT NOT NULL,
    "candidate" TEXT NOT NULL,
    "ground" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "filedAt" TIMESTAMP(3),
    "resolution" TEXT,
    "raterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetencyFramework" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "competencies" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "adoptedAt" TIMESTAMP(3),
    "raterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetencyFramework_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "AssessmentEvent" ADD CONSTRAINT "AssessmentEvent_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "Rater"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordedSimulation" ADD CONSTRAINT "RecordedSimulation_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "Rater"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerEvaluation" ADD CONSTRAINT "PeerEvaluation_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "Rater"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehavioralEvidence" ADD CONSTRAINT "BehavioralEvidence_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "Rater"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoringRubric" ADD CONSTRAINT "ScoringRubric_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "Rater"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyReport" ADD CONSTRAINT "CompetencyReport_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "Rater"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeAward" ADD CONSTRAINT "BadgeAward_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "Rater"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalibrationSession" ADD CONSTRAINT "CalibrationSession_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "Rater"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployerTranscript" ADD CONSTRAINT "EmployerTranscript_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "Rater"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "Rater"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyFramework" ADD CONSTRAINT "CompetencyFramework_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "Rater"("id") ON DELETE SET NULL ON UPDATE CASCADE;
