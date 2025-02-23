import { auth } from "@/app/api/auth/[...nextauth]/option";
import dbConnect from "@/backend/lib/dbConnect";
import UserModel from "@/backend/model/User";
import { Types } from "mongoose";
import { User } from "next-auth";

export async function GET() {
  const session = await auth();

  if (!session) {
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

  if (!user) {
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

  const userId = new Types.ObjectId(user._id);

  if (!userId) {
    return Response.json(
      {
        success: false,
        message: "UserId is required",
      },
      {
        status: 404,
      }
    );
  }

  await dbConnect();

  try {
    const userSpecificMessage = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
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

    if (!userSpecificMessage) {
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

    if (userSpecificMessage.length === 0) {
      return Response.json({
        success: true,
        messages: [],
      });
    }

    return Response.json(
      {
        success: true,
        messages: userSpecificMessage[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Unable to get messages", error);
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
