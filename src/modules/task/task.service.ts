import { prisma } from "../../config/prisma";
import { TaskStatus } from "@prisma/client";

export const createTask = async (
  userId: string,
  title: string,
  description?: string,
  startDate?: Date,
  startTime?: Date,
  endDate?: Date,
  endTime?: Date
) => {
  return prisma.task.create({
    data: {
      title,
      description,
      userId,
      startDate,
      startTime,
      endDate,
      endTime,
    },
  });
};

export const getTasks = async (
  userId: string,
  page: number,
  limit: number,
  status?: string,
  search?: string
) => {
  const skip = (page - 1) * limit;

  const whereClause: any = {
    userId,
    ...(status && { status }),
    ...(search && {
      title: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({
      where: whereClause,
    }),
  ]);

  return {
    data: tasks,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getTaskById = async (userId: string, taskId: string) => {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });
};

export const updateTask = async (
  userId: string,
  taskId: string,
  data: any
) => {
  return prisma.task.updateMany({
    where: {
      id: taskId,
      userId,
    },
    data,
  });
};

export const deleteTask = async (userId: string, taskId: string) => {
  return prisma.task.deleteMany({
    where: {
      id: taskId,
      userId,
    },
  });
};

export const toggleTask = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) return null;

  const newStatus =
    task.status === TaskStatus.Pending ? TaskStatus.Completed : TaskStatus.Pending;

  return prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });
};