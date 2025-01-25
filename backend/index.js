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

// 启动服务
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
