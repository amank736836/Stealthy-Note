import dbConnect from "@/backend/lib/dbConnect";
import UserModel from "@/backend/model/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { identifier, code } = await request.json();

    if (!identifier) {
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

    const decodedIdentifier = decodeURIComponent(identifier);

    const user = await UserModel.findOne({
      $or: [{ email: decodedIdentifier }, { username: decodedIdentifier }],
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid Username",
        },
        {
          status: 400,
        }
      );
    }

    if (user.isVerified) {
      return Response.json(
        {
          success: false,
          message: "User is already verified",
        },
        {
          status: 400,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;

    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.verifyCode = "";
      user.verifyCodeExpiry = new Date(-1); // Set to past date
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User Verified Successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification Code has expired, please signup again to get a new code",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid Code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error Verifying User", error);
    return Response.json(
      {
        success: false,
        message: "Error Verifying User",
      },
      {
        status: 400,
      }
    );
  }
}
