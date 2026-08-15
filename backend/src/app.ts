// What should my application know how to do

import  express from "express";
import  cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/health",(_req,res)=> {
    res.json({
        success:"true",
        message:"AI digital SAAS platform is running"
    })
})


export default app;

