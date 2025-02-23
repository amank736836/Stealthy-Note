import dbConnect from "@/backend/lib/dbConnect";
import { User } from "next-auth";

import { auth } from "@/app/api/auth/[...nextauth]/option";
import UserModel from "@/backend/model/User";

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const user: User = session.user as User;

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

  const userId = user._id;

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

  const { isAcceptingMessage } = await request.json();

  if (typeof isAcceptingMessage !== "boolean") {
    return Response.json(
      {
        success: false,
        message: "Accepting messages status is required",
      },
      {
        status: 400,
      }
    );
  }

  await dbConnect();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
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

    return Response.json(
      {
        success: true,
        message: "Messages acceptance status updated successfully",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to Update User Status to Accept Messages", error);
    return Response.json(
      {
        success: false,
        message: "Error accepting messages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  await dbConnect();
  const session = await auth();

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const user: User = session?.user as User;

  const userId = user._id;

  try {
    const user = await UserModel.findById(userId);

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

    return Response.json(
      {
        success: true,
        isAcceptingMessage: user.isAcceptingMessage,
        message: "Messages acceptance status fetched successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to get User Status to Accept Messages", error);
    return Response.json(
      {
        success: false,
        message: "Error in getting messages acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}
