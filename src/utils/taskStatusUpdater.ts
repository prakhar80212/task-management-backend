import { PrismaClient, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateTaskStatuses() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  
  const tasks = await prisma.task.findMany({
    where: {
      status: { in: [TaskStatus.Pending, TaskStatus.InProgress] },
      startTime: { not: null },
      endTime: { not: null }
    }
  });

  for (const task of tasks) {
    if (!task.startTime || !task.endTime) continue;
    
    const halfTime = new Date(
      (task.startTime.getTime() + task.endTime.getTime()) / 2
    );

    if (now >= task.endTime && task.status !== TaskStatus.Completed) {
      await prisma.task.update({
        where: { id: task.id },
        data: { status: TaskStatus.Completed }
      });
    } else if (now >= halfTime && now < task.endTime && task.status !== TaskStatus.InProgress) {
      await prisma.task.update({
        where: { id: task.id },
        data: { status: TaskStatus.InProgress }
      });
    } else if (now >= task.startTime && now < halfTime && task.status === TaskStatus.Pending) {
      await prisma.task.update({
        where: { id: task.id },
        data: { status: TaskStatus.InProgress }
      });
    }
  }
}

setInterval(updateTaskStatuses, 60000);
