// Глобальные переменные
let matchesData = [];
let username = localStorage.getItem('hockeyPredictionsUsername') || '';

// DOM элементы
const matchesContainer = document.getElementById('matches-container');
const usernameInput = document.getElementById('username');
const saveUsernameBtn = document.getElementById('save-username');

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadMatches();
    setupEventListeners();
    
    if (username) {
        usernameInput.value = username;
    }
});

function setupEventListeners() {
    saveUsernameBtn.addEventListener('click', saveUsername);
}

function saveUsername() {
    username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('hockeyPredictionsUsername', username);
        alert('Ник сохранен!');
    } else {
        alert('Пожалуйста, введите ваш ник');
    }
}

async function loadMatches() {
    try {
        // Для GitHub Pages используем raw.githubusercontent.com
        const response = await fetch('https://raw.githubusercontent.com/ваш-username/ваш-репозиторий/main/data.json');
        
        if (!response.ok) {
            throw new Error('Не удалось загрузить данные');
        }
        
        matchesData = await response.json();
        renderMatches();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        matchesContainer.innerHTML = '<p>Не удалось загрузить данные матчей. Пожалуйста, попробуйте позже.</p>';
    }
}

function renderMatches() {
    if (matchesData.length === 0) {
        matchesContainer.innerHTML = '<p>Нет запланированных матчей</p>';
        return;
    }
    
    matchesContainer.innerHTML = '';
    
    matchesData.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.className = 'match';
        
        const matchHeader = document.createElement('div');
        matchHeader.className = 'match-header';
        matchHeader.innerHTML = `
            <span>${match.team1} vs ${match.team2}</span>
            <span>${new Date(match.date).toLocaleString()}</span>
        `;
        
        const predictionsContainer = document.createElement('div');
        predictionsContainer.className = 'predictions';
        
        if (match.predictions && match.predictions.length > 0) {
            const predictionsTitle = document.createElement('h3');
            predictionsTitle.textContent = 'Прогнозы:';
            predictionsContainer.appendChild(predictionsTitle);
            
            match.predictions.forEach(pred => {
                const predElement = document.createElement('div');
                predElement.className = 'prediction-item';
                predElement.textContent = `${pred.username}: ${pred.score1}:${pred.score2}`;
                predictionsContainer.appendChild(predElement);
            });
        } else {
            predictionsContainer.innerHTML = '<p>Пока нет прогнозов</p>';
        }
        
        const predictionForm = document.createElement('div');
        predictionForm.className = 'prediction-form';
        predictionForm.innerHTML = `
            <input type="number" id="score1-${match.id}" placeholder="Счет ${match.team1}" min="0">
            <input type="number" id="score2-${match.id}" placeholder="Счет ${match.team2}" min="0">
            <button onclick="savePrediction(${match.id})">Отправить прогноз</button>
        `;
        
        matchElement.appendChild(matchHeader);
        matchElement.appendChild(predictionsContainer);
        matchElement.appendChild(predictionForm);
        
        matchesContainer.appendChild(matchElement);
    });
}

async function savePrediction(matchId) {
    if (!username) {
        alert('Пожалуйста, сначала введите и сохраните ваш ник');
        return;
    }
    
    const score1 = document.getElementById(`score1-${matchId}`).value;
    const score2 = document.getElementById(`score2-${matchId}`).value;
    
    if (!score1 || !score2) {
        alert('Пожалуйста, введите счет для обеих команд');
        return;
    }
    
    // На GitHub Pages мы не можем сохранять данные на сервер,
    // поэтому этот функционал будет работать только локально
    // или при использовании внешнего сервиса
    
    alert('На GitHub Pages сохранение прогнозов невозможно. Этот функционал работает только с бэкендом.');
    
    // В реальном проекте здесь был бы fetch запрос к API для сохранения прогноза
    // Например:
    /*
    try {
        const response = await fetch('/api/save-prediction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                matchId,
                username,
                score1,
                score2
            })
        });
        
        if (response.ok) {
            alert('Прогноз сохранен!');
            loadMatches(); // Обновляем список матчей
        } else {
            throw new Error('Ошибка сохранения');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось сохранить прогноз');
    }
    */
}