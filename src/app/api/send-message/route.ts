import dbConnect from "@/backend/lib/dbConnect";
import UserModel, { Message, User } from "@/backend/model/User";

export async function POST(request: Request) {
  const { username, content } = await request.json();

  if (!username) {
    return Response.json(
      {
        success: false,
        message: "Username is required",
      },
      {
        status: 400,
      }
    );
  }

  if (!content) {
    return Response.json(
      {
        success: false,
        message: "Content is required",
      },
      {
        status: 400,
      }
    );
  }

  await dbConnect();

  try {
    const user: User | null = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 400 }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unable to send message", error);
    return Response.json(
      {
        success: false,
        message: "Unable to send message",
      },
      { status: 500 }
    );
  }
}
