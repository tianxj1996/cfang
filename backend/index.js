const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000; // Render 默认使用环境变量 PORT
const cors = require("cors");
app.use(cors());


// 中间件
app.use(express.json());

// 示例 API 路由
app.get("/", (req, res) => {
    res.send("Hello, Render! Your backend is running.");
});

app.get("/api/players", (req, res) => {
    const players = [
        { name: "海盗船长", matches: [], netWins: 0, winRate: 0 },
        { name: "Sai", matches: [], netWins: 0, winRate: 0 },
    ];
    res.json(players);
});

// 启动服务
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
