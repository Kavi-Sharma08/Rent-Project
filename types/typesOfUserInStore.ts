import { User } from "./typesForUser"
export interface UserInStore{
    user :{
        currentUser : User | null
    }
    
}