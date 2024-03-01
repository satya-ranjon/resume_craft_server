import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  socialLogin: boolean;
  plan: {
    type: "free" | "premium" | "enterprise";
    downloadlimite: number;
    checkoutDate: number;
    timeLimite: number;
  };
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the name !"],
    },
    email: {
      type: String,
      required: [true, "Please enter the email !"],
      validate: {
        validator: async function (value: string) {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
        },
      },
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters !"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    socialLogin: {
      type: Boolean,
      default: false,
    },
    plan: {
      type: {
        type: String,
        required: true,
        enum: ["premium", "enterprise", "free"],
        default: "free",
      },
      downloadlimite: {
        type: Number,
        default: 10,
      },
      checkoutDate: {
        type: Number,
        default: Date.now,
      },
      timeLimite: {
        type: Number,
        default: 30,
      },
    },
  },
  { timestamps: true, versionKey: false }
);

// Hash Password before saving
userSchema.pre<IUser>("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (error: any) {
    return next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign Access token
userSchema.methods.SignAccessToken = function () {
  try {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET || "", {
      expiresIn: "5m",
    });
  } catch (error) {
    throw new Error("Error signing access token");
  }
};

// Sign Refresh token
userSchema.methods.SignRefreshToken = function () {
  try {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET || "", {
      expiresIn: "3d",
    });
  } catch (error) {
    throw new Error("Error signing refresh token");
  }
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
