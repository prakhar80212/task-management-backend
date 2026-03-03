import { Request, Response } from "express";
import { registerSchema, loginSchema, forgotPasswordSchema } from "./auth.validation";
import { registerUser, loginUser, resetPassword } from "./auth.service";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { prisma } from "../../config/prisma";

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    await registerUser(data.email, data.password);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const { accessToken, refreshToken } = await loginUser(
      data.email,
      data.password
    );

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ accessToken });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  const user = req.user as any;
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    })
    .redirect(`https://task-management-frontend-iup9qf3hj.vercel.app/auth/callback?token=${accessToken}`);
};

export const googleSignupCallback = async (req: Request, res: Response) => {
  const user = req.user as any;
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    })
    .redirect(`https://task-management-frontend-iup9qf3hj.vercel.app/auth/callback?token=${accessToken}`);
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = verifyRefreshToken(token) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user.id);

    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (token) {
    const decoded = verifyRefreshToken(token) as any;

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { refreshToken: null },
    });
  }

  res.clearCookie("refreshToken").json({ message: "Logged out" });
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const data = forgotPasswordSchema.parse(req.body);

    await resetPassword(data.email, data.newPassword);

    res.json({ message: "Password updated successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};