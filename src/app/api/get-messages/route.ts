import { getServerSession } from "next-auth";
import { nextOption } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { use } from "react";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(nextOption);

  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "NOt Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: true,
          message: "User not found",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Unexpected error",
      },
      {
        status: 500,
      }
    );
  }
}
