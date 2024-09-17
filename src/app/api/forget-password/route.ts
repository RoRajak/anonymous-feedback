import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import bcrypt from 'bcryptjs';
import UserModel from "@/models/User";
import { sendResetVerificationEmail } from '@/helpers/sendResetVerificationEmail';
import crypto from 'crypto';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email } = await request.json();
    const userByEmail = await UserModel.findOne({ email });

    if (!userByEmail) {
      return NextResponse.json({
        success: false,
        message: "If the user exists, a reset link will be sent to the provided email."
      }, { status: 200 });  
    }

    // Use crypto to generate a secure token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Store the hashed token and expiry in the database
    const hashedToken = await bcrypt.hash(token, 10);
    userByEmail.forgetToken = hashedToken;
    userByEmail.forgetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

    await userByEmail.save();

    // Send reset email
    const emailResponse = await sendResetVerificationEmail(email, userByEmail.username, token);

    if (!emailResponse.success) {
      return NextResponse.json({
        success: false,
        message: "Failed to send reset email. Please try again later."
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "If the user exists, a reset link will be sent to the provided email."
    }, { status: 200 });

  } catch (error) {
    console.error("Error while sending token", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while processing your request."
    }, { status: 500 });
  }
}
