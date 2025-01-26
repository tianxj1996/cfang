const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express(); // 初始化 Express 应用
const PORT = process.env.PORT || 3000;

// 连接 MongoDB
mongoose.connect("mongodb+srv://你的MongoDB连接字符串", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

// 定义玩家模型
const playerSchema = new mongoose.Schema({
    name: String,
    matches: [Number], // 比赛结果数组
    netWins: Number,
    winRate: Number,
});

const Player = mongoose.model("Player", playerSchema);

// 中间件
app.use(cors());
app.use(express.json());

// 路由示例
app.post("/api/addMatch", async (req, res) => {
    const { playerIndex, matchResult } = req.body;
    // 添加比赛逻辑
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
