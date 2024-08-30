import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number;

}

const connection:ConnectionObject={}

async function dbConnect():Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
    }

    try {
        const db=await mongoose.connect(process.env.MONOGODB_URI ||"",{})
        console.log(db);
        
        connection.isConnected=db.connections[0].readyState
        console.log(db.connections);
        
        console.log("DB connected successfully");
        
    } catch (error) {
        console.log("Database connection failed",error);
        
        process.exit(1)
    }
}

export default dbConnect