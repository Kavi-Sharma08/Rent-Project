import { Schema, Document, models, model, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
interface UserInterface extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  generateJWT(): string;
}

const UserSchema = new Schema<UserInterface>({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: true,
    unique: [true, "email should be unique"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => {
      const utc = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      return new Date(utc.getTime() + istOffset);
    },
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    console.log("Inside");
    try {
      this.password = await bcrypt.hash(this.password, 10);
      console.log("Password hashed:", this.password);
    } catch (err: any) {
      console.error("Error hashing password:", err);
      return next(err);
    }
  }
  next();
});

UserSchema.methods.generateJWT =function(){
  const token =jwt.sign({
    id : this._id,
    email : this.email
  },process.env.JWT_SECRET!,
  {expiresIn : "1d"}
  )
  return token;
}

const UserModel =
  (models.User as Model<UserInterface>) ||
  model<UserInterface>("User", UserSchema);

export default UserModel;
