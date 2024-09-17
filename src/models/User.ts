import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content:string;
    createdAt:Date;
}

const messageSchema:Schema<Message>= new Schema({
    content:{
        type:String,
        required:true

    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
});

export interface User extends Document {
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    forgetToken?:string;
    forgetTokenExpiry?:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[];
}

const userSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        ,"please use valid email address"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        
    },
    verifyCode:{
        type:String,
        required:[true,"verify code is required"],
    },
    forgetToken:{
        type:String,
        
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"verify code expiry is required"],
    },
    forgetTokenExpiry:{
        type:Date,
       
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true

    },
    isVerified:{
        type:Boolean,
        default:false
    },
    messages:[messageSchema]

})

const UserModel= (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",userSchema)

export default UserModel

