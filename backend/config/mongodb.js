import mongoose from "mongoose";

const connetDB = async () => {

    mongoose.connection.on('connected',() => {
        console.log("DB Connected to mongodb atlas online");
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/E-commerce`)
}

export default connetDB;