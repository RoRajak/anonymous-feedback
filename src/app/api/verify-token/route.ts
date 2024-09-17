import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const { username, password, token } = await request.json();  
    const decodedUsername=decodeURIComponent(username);
    // Find the user by email
    const user = await UserModel.findOne({ username:decodedUsername });
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }

    if (!user.forgetToken ||!user.forgetTokenExpiry) {
        return NextResponse.json(
          {
            success: false,
            message: "Token  is missing. Please request a password reset again.",
          },
          { status: 400 }
        );
      }

    // Compare the provided token with the stored hashed token
    const isTokenValid = await bcrypt.compare(token, user.forgetToken);

    // Check if the token has not expired
    const isTokenNotExpired = new Date(user.forgetTokenExpiry) > new Date();

    if (isTokenValid && isTokenNotExpired) {
      // Hash the new password and update it in the database
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;

      // Clear the forgetToken and expiry once the password is reset
      user.forgetToken = undefined;
      user.forgetTokenExpiry = undefined;
      
      await user.save();

      return NextResponse.json(
        {
          success: true,
          message: "Password reset successfully",
        },
        { status: 200 }
      );
    } else if (!isTokenNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message: "Reset password link has expired. Please request a new link.",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Token is incorrect.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error resetting password:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error occurred while resetting password.",
      },
      { status: 500 }
    );
  }
}
