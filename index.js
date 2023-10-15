import express from "express";
import cors from "cors";
import dbConnect from "./data/dbConnection/connectToDb.js";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRoute.js";

await dbConnect();

const app = express();

app.use(cookieParser()); 
app.use(express.json());


app.use(cors({
  origin: "https://unique-madeleine-1c17ab.netlify.app",
  credentials: true,
}));

app.get("/", (req, res) => {
  res.status(200).json({ message: "hello world" });
});

app.use("/user", UserRouter);
app.use("/product", productRouter);

const PORT = 3000;


app.listen(PORT, () => {
  console.log("App listening on port", PORT);
});
