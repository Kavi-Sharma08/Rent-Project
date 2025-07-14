import { createSlice} from "@reduxjs/toolkit";
import {User} from "@/types/typesForUser";
interface user {
    currentUser : User | null

}

const initialState : user = {
    currentUser : null


}
export const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        addUser : (state , action)=>{
            state.currentUser = action.payload
        }
    }

})

export const {addUser} = userSlice.actions;
export default userSlice.reducer