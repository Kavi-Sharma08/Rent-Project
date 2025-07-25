import { Schema, Document, models, model, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
export interface UserInterface extends Document {
  name: string,
  email: string,
  password: string,
  createdAt: Date,
  refreshToken : string,
  generateAccessToken(): string,
  generateRefreshToken() : Promise<string>,
  isPasswordValid(passwordFromUser : string) : Promise<boolean>
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
  refreshToken : {
    type : String,
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
    
    try {
      this.password = await bcrypt.hash(this.password, 10);
      
    } catch (err: any) {
      console.error("Error hashing password:", err);
      return next(err);
    }
  }
  next();
});

UserSchema.methods.generateAccessToken =function(){
  const accessToken =jwt.sign({
    id : this._id,
    email : this.email
  },process.env.JWT_SECRET!,
  {expiresIn : "1d"}
  )
  return accessToken;
}

UserSchema.methods.generateRefreshToken = async function(){
  const refreshToken = jwt.sign({
    id : this._id,
    email : this.email
    
  } , process.env.REFRESH_TOKEN_SECRET!)
  const hashedRefreshToken = await bcrypt.hash(refreshToken , 10);
  this.refreshToken = hashedRefreshToken;
  return refreshToken;
}
UserSchema.methods.isPasswordValid = async function(passwordFromUser : string){
  const isValid = await bcrypt.compare(passwordFromUser , this.password);
  if(isValid){
    return true;
  }
  return false;
}

const UserModel =
  (models.User as Model<UserInterface>) ||
  model<UserInterface>("User", UserSchema);

export default UserModel;
