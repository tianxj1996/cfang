const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// 连接 MongoDB 数据库
mongoose.connect("mongodb+srv://<username>:<password>@cluster.mongodb.net/match-tracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

// 定义玩家模型
const playerSchema = new mongoose.Schema({
    name: String,
    matches: [Number],
    netWins: Number,
    winRate: Number,
});

const Player = mongoose.model("Player", playerSchema);

// 添加初始玩家数据
async function addInitialPlayers() {
    const existingPlayers = await Player.find();
    if (existingPlayers.length === 0) {
        await Player.create([
            { name: "海盗船长", matches: [], netWins: 0, winRate: 0 },
            { name: "Sai", matches: [], netWins: 0, winRate: 0 },
        ]);
        console.log("Initial players added to the database.");
    } else {
        console.log("Players already exist in the database.");
    }
}
addInitialPlayers(); // 初始化玩家数据

// 中间件
app.use(cors());
app.use(express.json());

// 示例 API 路由
app.get("/", (req, res) => {
    res.send("Hello, MongoDB Backend is running!");
});

// 获取玩家数据
app.get("/api/players", async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (error) {
        console.error("Error fetching players:", error);
        res.status(500).json({ error: "Failed to fetch players" });
    }
});

// 启动服务
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
