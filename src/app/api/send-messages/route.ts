import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated",
        },
        {
          status: 404,
        }
      );
    }
    if (user.isAcceptingMessage) {
        return Response.json({
            success:false,
            message:"User not accepting the messages"
        },{
            status:403
        })
    }
    const  newMessage={content,createdAt:new Date()}
    user.messages.push(newMessage as Message);
    await user.save()
    return Response.json({
        success:false,
        message:"Failed to update user status to accept messages"
    },{
        status:500
    })
  } catch (error) {
    console.log("error adding messages",error);
    
    return Response.json({
        success:false,
        message:"internal server error"
    },{
        status:500
    })

  }
}
