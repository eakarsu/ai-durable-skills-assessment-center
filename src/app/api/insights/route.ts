import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";
import { records, errorResponse } from "@/lib/record-store";
import { buildInsights } from "@/lib/insights";
export const dynamic = "force-dynamic";
// Deterministic offline insights over own records. Never calls a provider.
export async function GET(_request: NextRequest) {
  try {
    await authorize();
    const take = { take: 1000, orderBy: [{ createdAt: "desc" }, { id: "desc" }] } as never;
    const [raters, evidence, reports, rubrics, disputes, badges, transcripts] = await Promise.all([
      records(prisma, "Rater").findMany(take), records(prisma, "BehavioralEvidence").findMany(take),
      records(prisma, "CompetencyReport").findMany(take), records(prisma, "ScoringRubric").findMany(take),
      records(prisma, "Dispute").findMany(take), records(prisma, "BadgeAward").findMany(take),
      records(prisma, "EmployerTranscript").findMany(take),
    ]);
    return Response.json(buildInsights({ raters, evidence, reports, rubrics, disputes, badges, transcripts }));
  } catch (error) { return errorResponse(error); }
}
