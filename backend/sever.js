const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/matchScoreTracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Player schema
const playerSchema = new mongoose.Schema({
    name: String,
    matches: [Number],
    netWins: Number,
    winRate: Number,
});

const Player = mongoose.model('Player', playerSchema);

// Initialize players
app.post('/initialize', async (req, res) => {
    const players = [
        '海盗船长', 'Sai', '兔谦', '痔疮', '川神', '老朱', '志神', '蟑螂恶霸',
        '冷神', '杀猪刀', '杀神', '冰山', 'letter神', '健身小子', '刘和珍君',
        'duo神', '亚军', 'waa', '陆河', '大漠孤狼', '安非他命', 'FJ', 'MPS', '老鸡',
    ];

    await Player.deleteMany();
    await Player.insertMany(
        players.map((name) => ({ name, matches: [], netWins: 0, winRate: 0 }))
    );

    res.send('Players initialized.');
});

// Get all players
app.get('/players', async (req, res) => {
    const players = await Player.find();
    res.json(players);
});

// Update match result
app.post('/updateMatch', async (req, res) => {
    const { playerId, matchResult } = req.body;

    if (![1, -1].includes(matchResult)) {
        return res.status(400).send('Invalid match result.');
    }

    const player = await Player.findById(playerId);
    if (!player) {
        return res.status(404).send('Player not found.');
    }

    player.matches.push(matchResult);
    player.netWins = player.matches.reduce((sum, match) => sum + match, 0);
    const winCount = player.matches.filter((match) => match === 1).length;
    player.winRate = ((winCount / player.matches.length) * 100).toFixed(2);

    await player.save();
    res.json(player);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
