const express = require("express");
const cors = require("cors"); // 引入 CORS
const app = express();
const PORT = process.env.PORT || 3000;

// 示例玩家数据
let players = [
    { name: "海盗船长", matches: [], netWins: 0, winRate: 0 },
    { name: "Sai", matches: [], netWins: 0, winRate: 0 },
];

// 中间件
app.use(cors()); // 启用跨域支持
app.use(express.json());

// 根路由
app.get("/", (req, res) => {
    res.send("Hello, Render! Your backend is running.");
});

// 获取玩家数据
app.get("/api/players", (req, res) => {
    res.json(players);
});

app.post("/api/addMatch", (req, res) => {
    const { playerIndex, matchResult } = req.body; // 从请求体中获取数据
    const player = players[playerIndex]; // 根据索引找到玩家

    // 验证数据
    if (!player || ![1, -1].includes(matchResult)) {
        return res.status(400).json({ error: "Invalid player or match result" });
    }

    // 更新玩家数据
    player.matches.push(matchResult);
    player.netWins = player.matches.reduce((sum, match) => sum + match, 0);
    const winCount = player.matches.filter(match => match === 1).length;
    player.winRate = ((winCount / player.matches.length) * 100).toFixed(2);

    // 返回更新后的玩家数据
    res.json(player);
});

// 启动服务
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
