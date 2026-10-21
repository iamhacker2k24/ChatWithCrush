require('dotenv').config()
const express = require("express");
const main = require("./Ai");
const app = express();
app.use(express.json());
const cors = require("cors");

// app.use(cors())
app.use(cors({
    origin: `${process.env.ORIGIN}`
}));

console.log()

app.post("/api/chat", async (req, res) => {
    try {
        const msg = req.body.message;
        const answer = await main(msg);
        console.log(answer)
        res.json({
            reply: answer
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        });
    }
});
app.get("/", (req, res) => {
    res.send("Server started perfectly")
})
app.listen(process.env.PORT, () => {
    console.log("server started")
})