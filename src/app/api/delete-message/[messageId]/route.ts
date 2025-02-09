import { auth } from "@/app/api/auth/[...nextauth]/option";
import dbConnect from "@/backend/lib/dbConnect";
import UserModel from "@/backend/model/User";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: {
      messageId: string;
    };
  }
) {
  const messageId = params.messageId;

  await dbConnect();

  const session = await auth();
  const user: User = session?.user as User;

  if (!session || !user) {
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

  try {
    const updatedResult = await UserModel.updateOne(
      {
        _id: user.id,
      },
      {
        $pull: {
          messages: {
            id: messageId,
          },
        },
      }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      {
        status: 500,
      }
    );
  }
}
