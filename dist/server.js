import { CohereClient } from "cohere-ai";
import { SYSTEM_PROMPT } from "./ai.js";
import { COHERE_API_KEY_LOCAL } from "./config.js";
import express from "express";
import cors from "cors";
const COHERE_API_KEY = process.env.COHERE_API_KEY || COHERE_API_KEY_LOCAL;
const app = express();
app.use(cors());
app.use(express.json());
const cohere = new CohereClient({
    token: COHERE_API_KEY,
});
app.post("/ask", async (req, res) => {
    try {
        const { message } = req.body;
        const userMessage = Array.isArray(message)
            ? message.join(", ")
            : message;
        console.log("receiving message", userMessage);
        const response = await cohere.chat({
            model: "tiny-aya-global",
            message: userMessage,
            preamble: SYSTEM_PROMPT,
        });
        console.log(response);
        res.json({
            reply: response.text ?? "No reply",
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("ERROR:", error);
        res.status(500).json({ error: message });
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
