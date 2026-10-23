import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";
import { RequestError, objectBody } from "@/lib/record-policy";
import { errorResponse } from "@/lib/record-store";
import { readJson } from "@/lib/request-body";
import { parseTaskPriority, parseTaskStatus, parseOptionalDate, parseOptionalId, parseOptionalText, parseTitle } from "@/lib/tasks";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

const include = {
  assignee: { select: { id: true, email: true, name: true, role: true } },
  createdBy: { select: { id: true, email: true, name: true, role: true } },
} as const;

export async function GET(_request: NextRequest, context: Context) {
  try {
    const user = await requireUser();
    if (!user) throw new RequestError("Sign in to continue", 401);
    const { id } = await context.params;
    const task = await prisma.staffTask.findUnique({ where: { id }, include });
    if (!task) throw new RequestError("Task not found", 404);
    return Response.json({ task, row: task });
  } catch (error) { return errorResponse(error); }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const user = await requireUser();
    if (!user) throw new RequestError("Sign in to continue", 401);
    const { id } = await context.params;
    const body = objectBody(await readJson(request));
    const allowed = new Set(["title", "description", "status", "priority", "assigneeId", "dueAt"]);
    for (const key of Object.keys(body)) if (!allowed.has(key)) throw new RequestError(`Unknown field: ${key}`, 400);
    const existing = await prisma.staffTask.findUnique({ where: { id } });
    if (!existing) throw new RequestError("Task not found", 404);
    const data: Record<string, unknown> = {};
    if ("title" in body) data.title = parseTitle(body.title);
    if ("description" in body) data.description = parseOptionalText(body.description, "description");
    if ("status" in body) {
      const status = parseTaskStatus(body.status, existing.status);
      data.status = status;
      data.completedAt = status === "DONE" ? (existing.completedAt ?? new Date()) : null;
    }
    if ("priority" in body) data.priority = parseTaskPriority(body.priority, existing.priority);
    if ("assigneeId" in body) {
      const assigneeId = parseOptionalId(body.assigneeId, "assigneeId");
      if (assigneeId) {
        const assignee = await prisma.user.findUnique({ where: { id: assigneeId }, select: { id: true } });
        if (!assignee) throw new RequestError("Assignee not found", 400);
      }
      data.assigneeId = assigneeId;
    }
    if ("dueAt" in body) data.dueAt = parseOptionalDate(body.dueAt, "dueAt");
    const task = await prisma.$transaction(async (tx) => {
      const updated = await tx.staffTask.update({ where: { id }, data, include });
      await tx.auditLog.create({ data: { actorId: user.id, actorName: user.name, action: "UPDATE", entity: "StaffTask", entityId: id, detail: JSON.stringify({ before: existing, after: updated }) } });
      return updated;
    });
    return Response.json({ task, row: task });
  } catch (error) { return errorResponse(error); }
}

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    const user = await requireUser();
    if (!user) throw new RequestError("Sign in to continue", 401);
    const { id } = await context.params;
    const existing = await prisma.staffTask.findUnique({ where: { id } });
    if (!existing) throw new RequestError("Task not found", 404);
    await prisma.$transaction(async (tx) => {
      await tx.staffTask.delete({ where: { id } });
      await tx.auditLog.create({ data: { actorId: user.id, actorName: user.name, action: "DELETE", entity: "StaffTask", entityId: id, detail: JSON.stringify({ before: existing }) } });
    });
    return Response.json({ ok: true });
  } catch (error) { return errorResponse(error); }
}
