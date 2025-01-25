const apiUrl = "https://my-backend-service.onrender.com"; // 替换为你的后端 URL

// 验证密码
function verifyPassword() {
    const enteredPassword = document.getElementById('adminPassword').value;
    if (enteredPassword === "111111") {
        alert("Access granted!");
        document.getElementById('adminControls').style.display = 'block';
    } else {
        alert("Incorrect password.");
    }
}

// 获取玩家数据
async function loadPlayers() {
    const response = await fetch(`${apiUrl}/api/players`);
    const players = await response.json();
    updateTable(players);
    populatePlayerSelect(players);
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

// 填充下拉菜单
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
    const playerIndex = document.getElementById('playerSelect').value;
    const matchResult = parseInt(document.getElementById('matchResult').value);
    if (isNaN(playerIndex) || isNaN(matchResult)) {
        alert("Invalid input");
        return;
    }
    await fetch(`${apiUrl}/api/addMatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerIndex, matchResult }),
    });
    loadPlayers();
}

// 页面加载时获取数据
loadPlayers();
