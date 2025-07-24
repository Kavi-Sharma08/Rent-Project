import { createSlice} from "@reduxjs/toolkit";
import {User , UserProfile} from "@/types/typesForUser";
interface user {
    currentUser : User | null,
    updatedProfileOfUser : UserProfile | null

}

const initialState : user = {
    currentUser : null,
    updatedProfileOfUser : null
}
export const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        addUser : (state , action)=>{
            state.currentUser = action.payload
        },
        addUserProfile : (state , action) =>{
            state.updatedProfileOfUser = action.payload

        }
    }

})

export const {addUser , addUserProfile} = userSlice.actions;
export default userSlice.reducer