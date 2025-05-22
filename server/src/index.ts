import express from "express";
import cors from "cors";
import { ENV } from "./env";

const app = express();

app.use(cors({
    origin: ENV.CLIENT_ORIGIN,
}));
app.use(express.json());

app.get('/api/welcome', (_req, res) => {
    res.json({message: "Welcome my friend, to the machine!"});
});

app.listen(ENV.PORT, () => {
   console.log(`Server is running on port ${ENV.PORT}`);
});
