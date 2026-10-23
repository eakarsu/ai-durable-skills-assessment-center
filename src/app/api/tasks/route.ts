import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";
import { RequestError } from "@/lib/record-policy";
import { errorResponse } from "@/lib/record-store";
import { readJson } from "@/lib/request-body";
import { objectBody } from "@/lib/record-policy";
import { parseTaskPriority, parseTaskStatus, parseOptionalDate, parseOptionalId, parseOptionalText, parseTitle } from "@/lib/tasks";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    if (!user) throw new RequestError("Sign in to continue", 401);
    const params = request.nextUrl.searchParams;
    const where: Record<string, unknown> = {};
    const status = params.get("status");
    const priority = params.get("priority");
    const assigneeId = params.get("assigneeId");
    if (status) where.status = parseTaskStatus(status);
    if (priority) where.priority = parseTaskPriority(priority);
    if (assigneeId) where.assigneeId = assigneeId;
    const q = (params.get("q") || "").slice(0, 200);
    if (q) where.OR = [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
    const tasks = await prisma.staffTask.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 200,
      include: {
        assignee: { select: { id: true, email: true, name: true, role: true } },
        createdBy: { select: { id: true, email: true, name: true, role: true } },
      },
    });
    return Response.json({ tasks, rows: tasks, total: tasks.length });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    if (!user) throw new RequestError("Sign in to continue", 401);
    const body = objectBody(await readJson(request));
    const allowed = new Set(["title", "description", "status", "priority", "assigneeId", "dueAt"]);
    for (const key of Object.keys(body)) if (!allowed.has(key)) throw new RequestError(`Unknown field: ${key}`, 400);
    const title = parseTitle(body.title);
    const description = parseOptionalText(body.description, "description");
    const status = parseTaskStatus(body.status);
    const priority = parseTaskPriority(body.priority);
    const assigneeId = parseOptionalId(body.assigneeId, "assigneeId");
    const dueAt = parseOptionalDate(body.dueAt, "dueAt");
    if (assigneeId) {
      const assignee = await prisma.user.findUnique({ where: { id: assigneeId }, select: { id: true } });
      if (!assignee) throw new RequestError("Assignee not found", 400);
    }
    const task = await prisma.$transaction(async (tx) => {
      const created = await tx.staffTask.create({
        data: { title, description, status, priority, assigneeId, createdById: user.id, dueAt, completedAt: status === "DONE" ? new Date() : null },
        include: {
          assignee: { select: { id: true, email: true, name: true, role: true } },
          createdBy: { select: { id: true, email: true, name: true, role: true } },
        },
      });
      await tx.auditLog.create({ data: { actorId: user.id, actorName: user.name, action: "CREATE", entity: "StaffTask", entityId: created.id, detail: JSON.stringify({ after: created }) } });
      return created;
    });
    return Response.json({ task, row: task }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}
