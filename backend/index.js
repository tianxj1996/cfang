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

        const matchCount = Math.abs(Math.round(matchResult));
        for (let i = 0; i < matchCount; i++) {
            player.matches.push(matchResult > 0 ? 1 : -1);
        }

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
