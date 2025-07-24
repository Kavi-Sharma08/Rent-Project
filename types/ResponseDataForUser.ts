import {User, UserProfile} from "@/types/typesForUser"
export interface LoginResponse {
  data: User;
}

export interface UpdateProfileResponse{
  data : UserProfile
}