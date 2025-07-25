import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
};


const connection : ConnectionObject = {};

async function DBconnect(){

    if(connection.isConnected){

        console.log("Database already connected");
        return;

    }

    try {
        
        const db = await mongoose.connect(process.env.MONGODBURL!);
        connection.isConnected = db.connections[0].readyState; // in readyState it give 1
        console.log("Database is connected Successfully");
        
    } catch (error) {
        console.log("Error in Db Connection");
        process.exit(1);
        
    }
}

export default DBconnect;

