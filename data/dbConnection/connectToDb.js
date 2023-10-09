import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnect = async () => {
  try {
    await connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Db connected Succesfully");
  } catch (err) {
    console.log(`error while connecting ${err}`);
  }
};

export default dbConnect;
