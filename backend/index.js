const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

let players = [
    { name: "海盗船长", matches: [], netWins: 0, winRate: 0 },
    { name: "Sai", matches: [], netWins: 0, winRate: 0 },
];

// 中间件
app.use(cors());
app.use(express.json());

// 根路由
app.get("/", (req, res) => {
    res.send("Hello, Render! Your backend is running.");
});

// 获取玩家数据
app.get("/api/players", (req, res) => {
    res.json(players);
});

// 添加玩家
app.post("/api/addPlayer", (req, res) => {
    const { name } = req.body;
    if (!name || players.some(player => player.name === name)) {
        return res.status(400).json({ error: "Invalid or duplicate player name" });
    }

    players.push({ name, matches: [], netWins: 0, winRate: 0 });
    res.json(players);
});

// 添加比赛结果
app.post("/api/addMatch", (req, res) => {
    const { playerIndex, matchResult } = req.body;
    const player = players[playerIndex];

    if (!player || ![1, -1].includes(matchResult)) {
        return res.status(400).json({ error: "Invalid player or match result" });
    }

    player.matches.push(matchResult);
    player.netWins = player.matches.reduce((sum, match) => sum + match, 0);
    const winCount = player.matches.filter(match => match === 1).length;
    player.winRate = ((winCount / player.matches.length) * 100).toFixed(2);

    res.json(player);
});

// 撤销上一次输入
app.post("/api/undoLastMatch", (req, res) => {
    const { playerIndex } = req.body;
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

    res.json(player);
});

// 清除所有玩家的比赛数据
app.post("/api/clearMatches", (req, res) => {
    const { adminPassword } = req.body;

    // 验证管理员密码
    if (adminPassword !== "666666") {
        return res.status(403).json({ error: "Invalid password. Access denied." });
    }

    players.forEach(player => {
        player.matches = [];
        player.netWins = 0;
        player.winRate = 0;
    });
    res.json({ message: "All match data cleared successfully", players });
});

// 启动服务
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
