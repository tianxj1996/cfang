const express = require("express");
const cors = require("cors"); // 确保启用跨域支持
const app = express();
const PORT = process.env.PORT || 3000;

// 示例玩家数据
let players = [
    { name: "海盗船长", matches: [], netWins: 0, winRate: 0 },
    { name: "Sai", matches: [], netWins: 0, winRate: 0 },
];

// 中间件
app.use(cors());
app.use(express.json());

// 获取玩家数据
app.get("/api/players", (req, res) => {
    res.json(players); // 返回 players 数据
});

// 启动服务
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
