import { Request, Response } from "express";
import {
  createTaskSchema,
  updateTaskSchema,
} from "./task.validation";
import * as TaskService from "./task.service";
import { AppError } from "../../utils/AppError";

export const create = async (req: any, res: Response) => {
  try {
    const data = createTaskSchema.parse(req.body);

    const startDateTime = new Date(`${data.startDate}T${data.startTime}:00+05:30`);
    const endDateTime = new Date(`${data.endDate}T${data.endTime}:00+05:30`);

    const task = await TaskService.createTask(
      req.userId,
      data.title,
      data.description,
      startDateTime,
      startDateTime,
      endDateTime,
      endDateTime
    );

    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (req: any, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const tasks = await TaskService.getTasks(
      req.userId,
      page,
      limit,
      status,
      search
    );

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const getOne = async (req: any, res: Response, next: any) => {
  try {
    const task = await TaskService.getTaskById(
      req.userId,
      req.params.id
    );

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: any, res: Response) => {
  try {
    const data = updateTaskSchema.parse(req.body);

    const updateData: any = {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.status && { status: data.status }),
    };

    if (data.startDate && data.startTime) {
      const startDateTime = new Date(`${data.startDate}T${data.startTime}:00+05:30`);
      updateData.startDate = startDateTime;
      updateData.startTime = startDateTime;
    }

    if (data.endDate && data.endTime) {
      const endDateTime = new Date(`${data.endDate}T${data.endTime}:00+05:30`);
      updateData.endDate = endDateTime;
      updateData.endTime = endDateTime;
    }

    const result = await TaskService.updateTask(
      req.userId,
      req.params.id,
      updateData
    );

    if (!result.count) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const remove = async (req: any, res: Response) => {
  const result = await TaskService.deleteTask(
    req.userId,
    req.params.id
  );

  if (!result.count) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task deleted" });
};

export const toggle = async (req: any, res: Response) => {
  const task = await TaskService.toggleTask(
    req.userId,
    req.params.id
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
};