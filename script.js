const apiUrl = "https://cfang-2.onrender.com"; 

const cors = require("cors");
app.use(cors());


async function loadPlayers() {
    try {
        const response = await fetch(`${apiUrl}/api/players`);
        if (!response.ok) throw new Error("Failed to load players");

        const players = await response.json();
        const playerTable = document.getElementById("playerTable");

        // 清空表格
        playerTable.innerHTML = `
            <tr>
                <th>Player</th>
                <th>Matches</th>
                <th>Win Rate (%)</th>
                <th>Net Wins</th>
                <th>Actions</th>
            </tr>
        `;

        // 填充玩家数据
        players.forEach((player, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${player.name}</td>
                <td>${player.matches.length}</td>
                <td>${player.winRate}</td>
                <td>${player.netWins}</td>
                <td>
                    <button onclick="deletePlayer('${player._id}')">Delete</button>
                </td>
            `;
            playerTable.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading players:", error);
        alert(error.message);
    }
}

function updateTable(players) {
    const tableBody = document.getElementById('scoreTable').querySelector('tbody');
    tableBody.innerHTML = '';
    players.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.matches.length}</td>
            <td>${player.winRate}</td>
            <td>${player.netWins}</td>
        `;
        tableBody.appendChild(row);
    });
}

function populatePlayerSelect(players) {
    const playerSelect = document.getElementById('playerSelect');
    playerSelect.innerHTML = '';
    players.forEach((player, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = player.name;
        playerSelect.appendChild(option);
    });
}

async function addPlayer() {
    const name = document.getElementById('newPlayerName').value.trim();
    if (!name) {
        alert("Player name cannot be empty.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/api/addPlayer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        const player = await response.json();
        loadPlayers();
        alert(`Player "${player.name}" added successfully.`);
    } catch (error) {
        console.error("Error adding player:", error);
        alert("Failed to add player.");
    }
}

async function deletePlayer(playerId) {
    try {
        const response = await fetch(`${apiUrl}/api/deletePlayer/${playerId}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete player");

        alert("Player deleted successfully!");
        loadPlayers(); // 重新加载玩家列表
    } catch (error) {
        console.error("Error deleting player:", error);
        alert(error.message);
    }
}

async function clearMatchData() {
    const adminPassword = document.getElementById('clearDataPassword').value.trim();
    if (!adminPassword) {
        alert("Please enter the admin password.");
        return;
    }

    const confirmClear = confirm("Are you sure you want to clear all match data?");
    if (!confirmClear) return;

    try {
        const response = await fetch(`${apiUrl}/api/clearMatches`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adminPassword }),
        });
        if (response.ok) {
            loadPlayers();
            alert("All match data cleared successfully.");
        } else {
            alert("Invalid password. Failed to clear match data.");
        }
    } catch (error) {
        console.error("Error clearing match data:", error);
    }
}

// 初始化
document.addEventListener("DOMContentLoaded", () => {
    loadPlayers();
});
