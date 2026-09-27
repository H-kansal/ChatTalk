// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI;

// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connection.on("connected", () => {
//   console.log("Mongo has connected succesfully");
// });
// mongoose.connection.on("reconnected", () => {
//   console.log("Mongo has reconnected");
// });
// mongoose.connection.on("error", (error) => {
//   console.log("Mongo connection has an error", error);
//   mongoose.disconnect();
// });
// mongoose.connection.on("disconnected", () => {
//   console.log("Mongo connection is disconnected");
// });



import mongoose from "mongoose";
import ApiError from "../utils/errorHandler.js";

 const ConnectDb=async()=>{
    try{
        const ConnectInstance=await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_Name}`);
        console.log(`your mongo connection is successful ${ConnectInstance.connection.host}`)
    }
    catch(error){
         throw new ApiError(500,"Db Connection Failed");
    }
 }
export default ConnectDb;