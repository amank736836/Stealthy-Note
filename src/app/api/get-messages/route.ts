import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import getServerSession from "next-auth";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authorized",
      },
      {
        status: 401,
      }
    );
  }

  const user: User = session?.user as User;

  const userId = new mongoose.Types.ObjectId(user.id);

  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          id: userId,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json({
      success: true,
      data: user[0].messages,
    });
  } catch (error) {
    
    return Response.json(
      {
        success: false,
        message: "Unable to get messages",
      },
      {
        status: 500,
      }
    );
  }
}
