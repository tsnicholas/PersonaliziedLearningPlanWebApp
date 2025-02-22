import express, { Request, Response } from "express";
import cors from 'cors';
import loginRoutes from "./routes/loginRoutes";
import moduleRoutes from "./routes/moduleRoutes";
import profileRoutes from "./routes/profileRoutes";
import goalRoutes from "./routes/goalRoutes";
import settingsRoute from "./routes/settingRoutes";
import { emailAboutCloseDueDates, updateCompletionStatus } from "./cronJobs/goalJobs";
import { updateCompletionPercent } from "./cronJobs/moduleJobs";
import tagRoute from "./routes/tagRoutes";
import inviteRoutes from "./routes/inviteRoutes";
import messageRoutes from "./routes/messageRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", loginRoutes);
app.use("/api/module", moduleRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/goal", goalRoutes);
app.use('/api/settings', settingsRoute);
app.use("/api/tag", tagRoute);
app.use("/api/invite", inviteRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/admin", adminRoutes);

app.get('/api', (req : Request, res : Response) => {
    console.log(req.body);
    res.send('Okay');
});

// When we host, cron jobs will be separate from the server.
app.listen(4000, () => {
    console.log("Server running!");
    emailAboutCloseDueDates.start();
    updateCompletionStatus.start();
    updateCompletionPercent.start();
});
