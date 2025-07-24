import { Schema , Document , Model , model ,  models } from "mongoose";

export interface UserProfileInterface extends Document{
    userId : Schema.Types.ObjectId
    college : string,
    phoneNumber : string,
    location : string,

}

const UserProfileSchema = new Schema<UserProfileInterface>({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    college : {
        type : String,

    },
    phoneNumber : {
        type : String,
    },
    location : {
        type : String,
        required : true
    }

})

const UserProfile =  (models.UserProfile as Model<UserProfileInterface>) || model<UserProfileInterface>("UserProfile" , UserProfileSchema);
export default UserProfile;