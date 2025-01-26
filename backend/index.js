const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express(); // 初始化 Express 应用
const PORT = process.env.PORT || 3000;

// 连接 MongoDB
mongoose.connect("mongodb+srv://tianxj1996:tianxj1996@cluster0.fuspy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

const playerSchema = new mongoose.Schema({
    name: String,
    matches: [Number], // 比赛结果（可以是任意数字）
    netWins: Number,
    winRate: Number,
});

const Player = mongoose.model("Player", playerSchema);

// 初始化玩家数据
async function addInitialPlayers() {
    const existingPlayers = await Player.find();
    if (existingPlayers.length === 0) {
        await Player.create([
            { name: "Player1", matches: [], netWins: 0, winRate: 0 },
            { name: "Player2", matches: [], netWins: 0, winRate: 0 },
        ]);
        console.log("Initial players added to the database.");
    }
}
addInitialPlayers(); // 初始化玩家数据

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

// 删除玩家
app.delete("/api/deletePlayer/:id", async (req, res) => {
    try {
        const playerId = req.params.id;
        const deletedPlayer = await Player.findByIdAndDelete(playerId);

        if (!deletedPlayer) {
            return res.status(404).json({ error: "Player not found" });
        }

        res.json({ message: "Player deleted successfully", player: deletedPlayer });
    } catch (error) {
        console.error("Error deleting player:", error);
        res.status(500).json({ error: "Failed to delete player" });
    }
});

// 添加比赛结果
app.post("/api/addMatch", async (req, res) => {
    const { playerIndex, matchResult } = req.body;

    if (typeof playerIndex !== "number" || typeof matchResult !== "number") {
        return res.status(400).json({ error: "Invalid player or match result" });
    }

    try {
        const players = await Player.find();
        const player = players[playerIndex];

        if (!player) {
            return res.status(404).json({ error: "Player not found" });
        }

        player.matches.push(matchResult);
        player.netWins = player.matches.reduce((sum, match) => sum + match, 0);
        const winCount = player.matches.filter(match => match > 0).length;
        player.winRate = player.matches.length > 0
            ? ((winCount / player.matches.length) * 100).toFixed(2)
            : 0;
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
        const winCount = player.matches.filter(match => match > 0).length;
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
