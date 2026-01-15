import mongoose from "mongoose";

const eventSchema= new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        slug:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        date:{
            type:Date,
            required:true,
        },
       price:{
            type:Number,
            required:true,
        },
        category:{
            type:mongoose.ObjectId,
            ref:"Category",
            required:true,
        },
        photo:{
            data:Buffer,
            contentType:String,
        },
        // ... inside eventSchema fields
ticketsAvailable: {
  type: Number,
  required: true,
  default: 0,
  min: 0,
},

       },
    {timestamps:true}
)
export default mongoose.model("Event",eventSchema);