const apiUrl = "https://cfang-2.onrender.com";

// 检查管理员密码并显示控件
function verifyPassword() {
    const adminPassword = document.getElementById("adminPassword").value.trim();
    if (adminPassword === "111111") {
        alert("Admin password verified.");
        document.getElementById("adminControls").style.display = "block"; // 显示管理员控件
        loadPlayers(); // 加载玩家列表
    } else {
        alert("Invalid admin password.");
    }
}

// 加载玩家列表
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

        // 填充下拉菜单
        populatePlayerSelect(players);
    } catch (error) {
        console.error("Error loading players:", error);
        alert(error.message);
    }
}

// 填充玩家下拉菜单
function populatePlayerSelect(players) {
    const playerSelect = document.getElementById("playerSelect");
    playerSelect.innerHTML = "";
    players.forEach((player, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = player.name;
        playerSelect.appendChild(option);
    });
}

// 添加比赛数据
async function addMatchResult() {
    const playerIndex = document.getElementById("playerSelect").value;
    const matchResult = parseInt(document.getElementById("matchResult").value);

    if (!playerIndex || ![1, -1].includes(matchResult)) {
        alert("Invalid player or match result.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/api/addMatch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerIndex, matchResult }),
        });

        if (response.ok) {
            loadPlayers();
            alert("Match result added successfully.");
        } else {
            alert("Failed to add match result.");
        }
    } catch (error) {
        console.error("Error adding match result:", error);
    }
}

// 添加新玩家
async function addPlayer() {
    const name = document.getElementById("newPlayerName").value.trim();
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

// 删除玩家
async function deletePlayer(playerId) {
    try {
        const response = await fetch(`${apiUrl}/api/deletePlayer/${playerId}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete player");

        alert("Player deleted successfully!");
        loadPlayers();
    } catch (error) {
        console.error("Error deleting player:", error);
        alert(error.message);
    }
}

// 清除比赛数据
async function clearMatchData() {
    const adminPassword = document.getElementById("clearDataPassword").value.trim();
    if (adminPassword !== "666666") {
        alert("Invalid password. Cannot clear match data.");
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
            alert("Failed to clear match data.");
        }
    } catch (error) {
        console.error("Error clearing match data:", error);
    }
}

// 初始化
document.addEventListener("DOMContentLoaded", () => {
    loadPlayers();
});
