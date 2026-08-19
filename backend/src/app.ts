// What should my application know how to do

import  express from "express";
import  cors from "cors";
import authRoutes from "./routes/auth.routes.js"
import meRoutes from "./routes/me.routes.js"
import agencyRoutes from "./routes/agency.routes.js";
import invitationRoutes from "./routes/invitation.routes.js";
import teamRoutes from "./routes/team.routes.js";
import clientRoutes from "./routes/client.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/health",(_req,res)=> {
    res.json({
        success:"true",
        message:"AI digital SAAS platform is running"
    })
})

app.use("/api/auth", authRoutes);
app.use("/api/me",meRoutes);
app.use("/api/agency",agencyRoutes);
app.use("/api/invitations",invitationRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/clients", clientRoutes);


export default app;

