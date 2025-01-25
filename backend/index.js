const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB 连接  
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4, // 强制使用 IPv4
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

// 定义玩家模型
const playerSchema = new mongoose.Schema({
    name: String,
    matches: [Number], // 每场比赛的结果 (1 或 -1)
    netWins: Number,
    winRate: Number,
});

const Player = mongoose.model("Player", playerSchema);

// 初始化玩家数据
async function addInitialPlayers() {
    const existingPlayers = await Player.find();
    if (existingPlayers.length === 0) {
        await Player.create([
            { name: "海盗船长", matches: [], netWins: 0, winRate: 0 },
            { name: "Sai", matches: [], netWins: 0, winRate: 0 },
        ]);
        console.log("Initial players added to the database.");
    }
}
addInitialPlayers(); // 调用初始化函数

// 中间件
app.use(cors());
app.use(express.json());

// 获取所有玩家数据
app.get("/api/players", async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (error) {
        console.error("Error fetching players:", error);
        res.status(500).json({ error: "Failed to fetch players" });
    }
});

// 添加新玩家
app.post("/api/addPlayer", async (req, res) => {
    const { name } = req.body;
    if (!name || await Player.findOne({ name })) {
        return res.status(400).json({ error: "Invalid or duplicate player name" });
    }

    try {
        const newPlayer = new Player({ name, matches: [], netWins: 0, winRate: 0 });
        await newPlayer.save();
        res.json(newPlayer);
    } catch (error) {
        console.error("Error adding player:", error);
        res.status(500).json({ error: "Failed to add player" });
    }
});

// 添加比赛结果
app.post("/api/addMatch", async (req, res) => {
    const { playerIndex, matchResult } = req.body;

    try {
        const players = await Player.find();
        const player = players[playerIndex];

        if (!player || ![1, -1].includes(matchResult)) {
            return res.status(400).json({ error: "Invalid player or match result" });
        }

        player.matches.push(matchResult);
        player.netWins = player.matches.reduce((sum, match) => sum + match, 0);
        const winCount = player.matches.filter(match => match === 1).length;
        player.winRate = ((winCount / player.matches.length) * 100).toFixed(2);
        await player.save();

        res.json(player);
    } catch (error) {
        console.error("Error adding match result:", error);
        res.status(500).json({ error: "Failed to add match result" });
    }
});

// 撤销上一次比赛结果
app.post("/api/undoLastMatch", async (req, res) => {
    const { playerIndex } = req.body;

    try {
        const players = await Player.find();
        const player = players[playerIndex];

        if (!player || player.matches.length === 0) {
            return res.status(400).json({ error: "Invalid player or no matches to undo" });
        }

        player.matches.pop(); // 移除最后一次比赛结果
        player.netWins = player.matches.reduce((sum, match) => sum + match, 0);
        const winCount = player.matches.filter(match => match === 1).length;
        player.winRate = player.matches.length > 0
            ? ((winCount / player.matches.length) * 100).toFixed(2)
            : 0;
        await player.save();

        res.json(player);
    } catch (error) {
        console.error("Error undoing last match:", error);
        res.status(500).json({ error: "Failed to undo last match" });
    }
});

// 清除所有比赛数据（需要管理员密码）
app.post("/api/clearMatches", async (req, res) => {
    const { adminPassword } = req.body;

    // 验证管理员密码
    if (adminPassword !== "666666") {
        return res.status(403).json({ error: "Invalid password. Access denied." });
    }

    try {
        await Player.updateMany({}, { $set: { matches: [], netWins: 0, winRate: 0 } });
        const players = await Player.find();
        res.json({ message: "All match data cleared successfully", players });
    } catch (error) {
        console.error("Error clearing match data:", error);
        res.status(500).json({ error: "Failed to clear match data" });
    }
});

// 启动服务
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
