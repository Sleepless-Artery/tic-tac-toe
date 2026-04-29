let gameId = null;
let board = [];
let players = {};

function goMenu() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('game').style.display = 'none';
    document.getElementById('history').style.display = 'none';

    document.getElementById('playerX').value = '';
    document.getElementById('playerO').value = '';

    document.getElementById('error').textContent = '';
    document.getElementById('playerX').classList.remove('error');
    document.getElementById('playerO').classList.remove('error');
}

function clearErrors() {
    document.getElementById('error').textContent = '';
    document.getElementById('playerX').classList.remove('error');
    document.getElementById('playerO').classList.remove('error');
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('playerX').addEventListener('input', clearErrors);
    document.getElementById('playerO').addEventListener('input', clearErrors);
});

function startGame() {
    const playerXInput = document.getElementById('playerX');
    const playerOInput = document.getElementById('playerO');
    const errorDiv = document.getElementById('error');

    const playerX = playerXInput.value.trim();
    const playerO = playerOInput.value.trim();

    errorDiv.textContent = '';
    playerXInput.classList.remove('error');
    playerOInput.classList.remove('error');

    let hasError = false;

    if (!playerX) {
        playerXInput.classList.add('error');
        hasError = true;
    }

    if (!playerO) {
        playerOInput.classList.add('error');
        hasError = true;
    }

    if (hasError) {
        errorDiv.textContent = "Введите имена обоих игроков";
        return;
    }

    fetch('/api/games/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            player_x: playerX,
            player_o: playerO
        })
    })
    .then(async (res) => {
        const contentType = res.headers.get("content-type");

        let data = {};

        if (contentType && contentType.includes("application/json")) {
            data = await res.json().catch(() => ({}));
        } else {
            const text = await res.text();
            console.error("Non-JSON response:", text);
        }

        return { res, data };
    })
    .then(({ res, data }) => {

        if (!res.ok) {
            const msg =
                data.non_field_errors?.[0] ||
                data.detail ||
                data.error ||
                "Ошибка создания игры";

            const errorDiv = document.getElementById('error');
            errorDiv.textContent = msg;

            document.getElementById('playerX').classList.add('error');
            document.getElementById('playerO').classList.add('error');

            return;
        }

        startGameUI(data);
    })
    .catch((err) => {
        console.error(err);
        document.getElementById('error').textContent = "Сетевая ошибка";
    });
}

function startGameUI(data) {
    gameId = data.id;

    players = {
        X: data.player_x,
        O: data.player_o
    };

    board = data.board.split('');

    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    updateStatus(data.current_player);
    renderBoard();
}

function renderBoard() {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = '';

    board.forEach((cell, index) => {
        const div = document.createElement('div');
        div.className = 'cell';
        div.innerText = cell === '-' ? '' : cell;

        div.onclick = () => makeMove(index);

        boardDiv.appendChild(div);
    });
}

function makeMove(position) {
    fetch(`/api/games/${gameId}/move/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position })
    })
    .then(res => res.json().then(data => ({ res, data })))
    .then(({ res, data }) => {

        if (!res.ok) {
            console.error(data);
            return;
        }

        board = data.board.split('');
        renderBoard();

        if (data.status === 'win') {
            highlightWin(data.winning_cells);

            const winnerName = players[data.winner];
            alert("Победитель: " + winnerName);

            updateStatus(data.winner);
            return;
        }

        if (data.status === 'draw') {
            alert("Ничья");
            return;
        }

        updateStatus(data.current_player);
    });
}

function updateStatus(current) {
    document.getElementById('status').innerText =
        "Ход: " + players[current];
}

function highlightWin(cells) {
    if (!cells) return;

    cells.forEach(i => {
        document.querySelectorAll('.cell')[i].style.background = "#b6fcb6";
    });
}

function loadHistory() {
    fetch('/api/games/history/')
    .then(res => res.json())
    .then(data => {

        let html = '';

        data.forEach(game => {

            let winnerName = "-";

            if (game.winner === 'X') {
                winnerName = game.player_x;
            } else if (game.winner === 'O') {
                winnerName = game.player_o;
            }

            html += `
                <div class="history-item">
                    <b>${game.player_x} vs ${game.player_o}</b><br>
                    Победитель: <span class="win">${winnerName}</span>
                </div>
            `;
        });

        document.getElementById('historyList').innerHTML = html;

        document.getElementById('menu').style.display = 'none';
        document.getElementById('history').style.display = 'block';
    });
}