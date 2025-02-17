import dbConnect from "@/backend/lib/dbConnect";
import UserModel from "@/backend/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { identifier, code, newPassword } = await request.json();

    if (!identifier) {
      return Response.json(
        {
          success: false,
          message: "Identifier is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!code) {
      return Response.json(
        {
          success: false,
          message: "Code is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!newPassword) {
      return Response.json(
        {
          success: false,
          message: "New Password is required",
        },
        {
          status: 400,
        }
      );
    }

    const decodedIdentifier = decodeURIComponent(identifier);

    const user = await UserModel.findOne({
      $or: [{ email: decodedIdentifier }, { username: decodedIdentifier }],
    });

    if (!user) {
      throw new Error("No user found with this username or email");
    }

    if (user.verifyCode !== code) {
      return Response.json(
        {
          success: false,
          message: "Invalid code",
        },
        {
          status: 400,
        }
      );
    }

    if (user.verifyCodeExpiry < new Date()) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired. Please request a new one",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    if (user.isVerified === false) {
      user.isVerified = true;
    }

    user.verifyCode = "";
    user.verifyCodeExpiry = new Date(-1);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Password updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: `Error in setting new password: ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}
