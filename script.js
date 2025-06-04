document.addEventListener('DOMContentLoaded', function() {
    const authSection = document.getElementById('auth-section');
    const predictSection = document.getElementById('predict-section');
    const successMessage = document.getElementById('success-message');
    const loginBtn = document.getElementById('login-btn');
    const submitBtn = document.getElementById('submit-predictions');
    const newPredictBtn = document.getElementById('new-predictions');
    const usernameInput = document.getElementById('username');
    const greetingSpan = document.getElementById('greeting');
    const matchesContainer = document.getElementById('matches-container');

    // Пример данных о матчах (в реальном приложении можно загружать с сервера)
    const upcomingMatches = [
        {
            id: 1,
            homeTeam: 'СКА',
            awayTeam: 'ЦСКА',
            date: '2023-12-15 19:30',
            league: 'КХЛ'
        },
        {
            id: 2,
            homeTeam: 'Ак Барс',
            awayTeam: 'Салават Юлаев',
            date: '2023-12-16 17:00',
            league: 'КХЛ'
        },
        {
            id: 3,
            homeTeam: 'Торонто Мейпл Лифс',
            awayTeam: 'Бостон Брюинз',
            date: '2023-12-17 02:00',
            league: 'НХЛ'
        }
    ];

    // Обработчик входа
    loginBtn.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        
        if (username) {
            // Сохраняем имя пользователя
            localStorage.setItem('hockeyPredictorUsername', username);
            
            // Показываем раздел с прогнозами
            authSection.classList.add('hidden');
            predictSection.classList.remove('hidden');
            greetingSpan.textContent = username;
            
            // Загружаем матчи
            loadMatches();
        } else {
            alert('Пожалуйста, введите ваш ник!');
        }
    });

    // Загрузка матчей
    function loadMatches() {
        matchesContainer.innerHTML = '';
        
        upcomingMatches.forEach(match => {
            const matchElement = document.createElement('div');
            matchElement.className = 'match-card';
            matchElement.innerHTML = `
                <div class="match-teams">${match.homeTeam} vs ${match.awayTeam}</div>
                <div class="match-date">${match.date} (${match.league})</div>
                <div class="predict-options">
                    <div class="predict-option">
                        <label>
                            <input type="radio" name="match_${match.id}" value="home" required>
                            Победа ${match.homeTeam}
                        </label>
                    </div>
                    <div class="predict-option">
                        <label>
                            <input type="radio" name="match_${match.id}" value="away" required>
                            Победа ${match.awayTeam}
                        </label>
                    </div>
                    <div class="predict-option">
                        <label>
                            <input type="radio" name="match_${match.id}" value="draw" required>
                            Ничья
                        </label>
                    </div>
                </div>
            `;
            
            matchesContainer.appendChild(matchElement);
        });
    }

    // Отправка прогнозов
    submitBtn.addEventListener('click', function() {
        const predictions = [];
        let allPredictionsMade = true;
        
        upcomingMatches.forEach(match => {
            const selectedOption = document.querySelector(`input[name="match_${match.id}"]:checked`);
            
            if (selectedOption) {
                predictions.push({
                    matchId: match.id,
                    prediction: selectedOption.value
                });
            } else {
                allPredictionsMade = false;
            }
        });
        
        if (allPredictionsMade) {
            // В реальном приложении здесь бы отправлялись данные на сервер
            const username = localStorage.getItem('hockeyPredictorUsername');
            localStorage.setItem(`predictions_${username}`, JSON.stringify(predictions));
            
            // Показываем сообщение об успехе
            predictSection.classList.add('hidden');
            successMessage.classList.remove('hidden');
        } else {
            alert('Пожалуйста, сделайте прогноз для всех матчей!');
        }
    });

    // Новые прогнозы
    newPredictBtn.addEventListener('click', function() {
        successMessage.classList.add('hidden');
        predictSection.classList.remove('hidden');
    });

    // Проверяем, есть ли сохраненное имя пользователя
    const savedUsername = localStorage.getItem('hockeyPredictorUsername');
    if (savedUsername) {
        authSection.classList.add('hidden');
        predictSection.classList.remove('hidden');
        greetingSpan.textContent = savedUsername;
        loadMatches();
    }
});