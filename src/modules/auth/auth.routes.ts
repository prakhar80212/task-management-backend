import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  googleCallback,
  googleSignupCallback,
  forgotPassword,
} from "./auth.controller";
import passport from "../../config/passport";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot", forgotPassword);

router.get(
  "/google",
  passport.authenticate("google-login", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google-login", { session: false, failureRedirect: "https://task-management-frontend-iup9qf3hj.vercel.app/auth/callback?error=user_not_found" }),
  googleCallback
);

router.get(
  "/google/signup",
  passport.authenticate("google-signup", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/signup/callback",
  passport.authenticate("google-signup", { session: false, failureRedirect: "https://task-management-frontend-iup9qf3hj.vercel.app/auth/callback?error=user_already_exists" }),
  googleSignupCallback
);

export default router;