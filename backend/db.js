const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://<username>:<password>@cluster.mongodb.net/match-tracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

const playerSchema = new mongoose.Schema({
    name: String,
    matches: [Number],
    netWins: Number,
    winRate: Number,
});

const Player = mongoose.model("Player", playerSchema);

module.exports = { mongoose, Player };