const apiUrl = "https://cfang-2.onrender.com"; // 替换为你的后端 URL

// 验证管理员密码
function verifyPassword() {
    const enteredPassword = document.getElementById('adminPassword').value;
    if (enteredPassword === "111111") {
        alert("Access granted!");
        document.getElementById('adminControls').style.display = 'block';
    } else {
        alert("Incorrect password.");
    }
}

// 加载玩家数据
async function loadPlayers() {
    try {
        const response = await fetch(`${apiUrl}/api/players`);
        const players = await response.json();
        console.log("Players fetched from API:", players);
        updateTable(players);
        populatePlayerSelect(players);
    } catch (error) {
        console.error("Error loading players:", error);
    }
}

// 更新表格
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

// 更新下拉菜单
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

// 添加比赛结果
async function addMatchResult() {
    const playerIndex = parseInt(document.getElementById('playerSelect').value);
    const matchResult = parseInt(document.getElementById('matchResult').value);

    if (isNaN(playerIndex) || ![1, -1].includes(matchResult)) {
        alert("Please select a valid player and match result (1 or -1).");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/api/addMatch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerIndex, matchResult }),
        });

        if (!response.ok) {
            throw new Error("Failed to add match result");
        }

        await loadPlayers(); // 重新加载玩家数据
    } catch (error) {
        console.error("Error adding match result:", error);
        alert("Failed to add match result.");
    }

    document.getElementById('matchResult').value = '';
}

// 添加玩家
async function addPlayer() {
    const newPlayerName = document.getElementById('newPlayerName').value.trim();

    if (!newPlayerName) {
        alert("Player name cannot be empty.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/api/addPlayer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newPlayerName }),
        });

        if (!response.ok) {
            const { error } = await response.json();
            throw new Error(error || "Failed to add player");
        }

        await loadPlayers(); // 重新加载玩家数据
        alert(`Player "${newPlayerName}" added successfully.`);
    } catch (error) {
        console.error("Error adding player:", error);
        alert("Failed to add player.");
    }

    document.getElementById('newPlayerName').value = '';
}

// 撤销上一次输入
async function undoLastMatch() {
    const playerIndex = parseInt(document.getElementById('playerSelect').value);

    if (isNaN(playerIndex)) {
        alert("Please select a valid player.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/api/undoLastMatch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerIndex }),
        });

        if (!response.ok) {
            const { error } = await response.json();
            throw new Error(error || "Failed to undo last match");
        }

        await loadPlayers(); // 重新加载玩家数据
        alert("Last match result undone successfully.");
    } catch (error) {
        console.error("Error undoing last match:", error);
        alert("Failed to undo last match.");
    }
}

// 页面加载时初始化
document.addEventListener("DOMContentLoaded", () => {
    loadPlayers();
});
