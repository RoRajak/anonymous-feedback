import { resend } from "@/lib/resend";
import ResetEmail from "../../emails/ResetEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendResetVerificationEmail(
  email: string,
  username: string,
  verifyToken: string
): Promise<ApiResponse> {
  try {

    await resend.emails.send({
      from: "True Company <onboarding@pioneer.run.place>",
      to: email,
      subject: "Reset your password",
      react: ResetEmail({username,token:verifyToken}),
    });

    return { success: true, message: "Reset Email sent successfully" };
  } catch (emailError) {
    console.error("Error sending reset email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
