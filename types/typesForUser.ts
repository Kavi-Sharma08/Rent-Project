export interface User{
    _id : string,
    name : string,
    email : string,
    password : string,
    createdAt? : string,
    refreshToken?:string

}

export interface UserProfile{
    _id : string,
    userId : string,
    college : string,
    location : string,
    phoneNumber : string,
}