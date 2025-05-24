import mongoose from "mongoose"; //import mongoose bcuz we are connecting to a mongoDB database


const connectdb = async () => {
    try {
       await mongoose.connect(process.env.MONGO_URI); //connect to the database
       console.log("MongoDB connected successfully!!");  //log the successfull message
    } catch (error) {
        console.log(error); //log the error message
        process.exit(1);
}
};

export default connectdb; //export the connectdb function