import { createSlice} from "@reduxjs/toolkit";
import {User , UserProfile} from "@/types/typesForUser";
import { IProduct } from "@/models/Product.model";

export interface ProductOfUserInterface extends Omit<IProduct , "college" | "phoneNumber" | "createdAt">{

} 
interface user {
    currentUser : User | null,
    updatedProfileOfUser : UserProfile | null,
    productDetailsOfUser : ProductOfUserInterface | null;

}

const initialState : user = {
    currentUser : null,
    updatedProfileOfUser : null,
    productDetailsOfUser : null

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

        },
        productDetailsOfUser : (state , action)=>{
            state.productDetailsOfUser = action.payload


        },
        logoutUser : (state)=>{
            state.currentUser = null;
            state.updatedProfileOfUser = null;

        }
    }

})

export const {addUser , addUserProfile , logoutUser , productDetailsOfUser} = userSlice.actions;
export default userSlice.reducer