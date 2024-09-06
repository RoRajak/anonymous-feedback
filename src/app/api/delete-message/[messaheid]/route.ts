import { getServerSession } from "next-auth";
import { nextOption } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function DELETE(request: Request,{params}:{params:{messageid:string}}) {

    const messageid=params.messageid;

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

  
  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }

  

 
}
