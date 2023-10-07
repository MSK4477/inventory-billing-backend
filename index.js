import express from "express";
import dbConnect from "./data/dbConnection/connectToDb.js";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRoute.js";
const app = express();
const PORT = 3000;

app.use(cookieParser()); 
app.use(express.json()); 

dbConnect();
app.use("/user", UserRouter);
app.use("/product", productRouter)


app.get("/", (req, res) => {
    res.status(200).json({ message: "hello world" });
});

app.listen(PORT, () => {
    console.log("App listening on port", PORT);
});
