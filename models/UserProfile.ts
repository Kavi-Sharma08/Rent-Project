import { Schema , Document , Model , model ,  models } from "mongoose";

export interface UserProfileInterface extends Document{
    user : Schema.Types.ObjectId
    college : Schema.Types.ObjectId,
    branch : string,
    phoneNumber : string,
    location : string,
    profileCompletion : number

}

const UserProfileSchema = new Schema<UserProfileInterface>({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    college : {
        type : Schema.Types.ObjectId,
        ref : "College",
        required : true,

    },
    branch :{
        type : String,
    },
    phoneNumber : {
        type : String,
    },
    location : {
        type : String,
        required : true
    },
    profileCompletion :{
        type : Number,
        default : 30
    }

})

const UserProfile =  (models.UserProfile as Model<UserProfileInterface>) || model<UserProfileInterface>("UserProfile" , UserProfileSchema);
export default UserProfile;