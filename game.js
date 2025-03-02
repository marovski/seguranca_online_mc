class SecurityGame {
    constructor() {
        this.currentLevel = 0;
        this.score = 0;
        this.levels = [
            {
                title: "Criação de Palavras-passe Fortes",
                type: "password",
                description: "Selecione a palavra-passe mais segura:",
                options: [
                    {text: "password123", correct: false},
                    {text: "MinhaDataNascimento1990", correct: false},
                    {text: "K9$mP#2@vL5nX", correct: true},
                    {text: "qwerty", correct: false}
                ],
                feedback: {
                    success: "Excelente! Uma palavra-passe forte combina letras maiúsculas e minúsculas, números e símbolos.",
                    failure: "Esta palavra-passe não é suficientemente segura. Tente ủytilizar uma combinação de caracteres diferentes."
                }
            },
            {
                title: "Autenticação de Dois Fatores",
                type: "2fa",
                description: "Qual é a melhor opção para configurar 2FA?",
                options: [
                    {text: "Usar apenas palavra-passe", correct: false},
                    {text: "SMS + palavra-passe", correct: false},
                    {text: "Aplicação autenticador + palavra-passe", correct: true},
                    {text: "Email de recuperação", correct: false}
                ],
                feedback: {
                    success: "Correto! Uma aplicação autenticador é mais segura que SMS para 2FA.",
                    failure: "Esta não é a opção mais segura para 2FA."
                }
            },
            {
                title: "Identificação de Phishing",
                type: "phishing",
                description: "Identifique o email suspeito:",
                options: [
                    {text: "suporte@bancodoportugal.pt - Atualização de segurança necessária", correct: false},
                    {text: "banco-portugal-urgente@mail.ru - O seu acesso foi bloqueado", correct: true},
                    {text: "newsletter@bancoportugal.pt - Relatório mensal", correct: false},
                    {text: "contacto@bancoportugal.pt - Confirmação de transferência", correct: false}
                ],
                feedback: {
                    success: "Correto! Emails de domínios suspeitos e mensagens urgentes são sinais comuns de phishing.",
                    failure: "Preste atenção ao domínio do email e ao tom urgente da mensagem."
                }
            }
        ];

        this.initializeGame();
        this.updateVisitCounter();
    }

    initializeGame() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('continue-btn').addEventListener('click', () => this.hideModal());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
    }

    startGame() {
        this.switchScreen('title-screen', 'game-screen');
        this.loadLevel();
    }

    switchScreen(from, to) {
        document.getElementById(from).classList.remove('active');
        document.getElementById(to).classList.add('active');
    }

    loadLevel() {
        if (this.currentLevel >= this.levels.length) {
            this.endGame();
            return;
        }

        const level = this.levels[this.currentLevel];
        const levelEmojis = {
            "password": "🔑",
            "2fa": "📱",
            "phishing": "📧"
        };

        document.getElementById('level-title').textContent = `${levelEmojis[level.type]} ${level.title}`;
        document.getElementById('progress').style.width = `${(this.currentLevel / this.levels.length) * 100}%`;

        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = `
            <p>${level.description}</p>
            <div class="options">
                ${level.options.map((option, index) => `
                    <button class="choice-btn" data-correct="${option.correct}">
                        ${option.text}
                    </button>
                `).join('')}
            </div>
        `;

        gameArea.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAnswer(e));
        });
    }

    handleAnswer(e) {
        const correct = e.target.dataset.correct === 'true';
        const level = this.levels[this.currentLevel];

        if (correct) {
            this.score += 100;
            document.getElementById('score-value').textContent = this.score;
        }

        this.showFeedback(correct ? level.feedback.success : level.feedback.failure, correct);
    }

    showFeedback(message, correct) {
        const modal = document.getElementById('feedback-modal');
        const feedbackEmoji = document.getElementById('feedback-emoji');
        
        document.getElementById('feedback-title').textContent = correct ? "Correto! ✅" : "Incorreto ❌";
        document.getElementById('feedback-text').textContent = message;
        feedbackEmoji.textContent = correct ? "🌟" : "😔";
        modal.style.display = 'flex';
    }

    hideModal() {
        document.getElementById('feedback-modal').style.display = 'none';
        this.currentLevel++;
        this.loadLevel();
    }

    endGame() {
        document.getElementById('final-score').textContent = this.score;
        this.switchScreen('game-screen', 'end-screen');
    }

    restartGame() {
        this.currentLevel = 0;
        this.score = 0;
        document.getElementById('score-value').textContent = this.score;
        this.switchScreen('end-screen', 'title-screen');
    }

    updateVisitCounter() {
        // Get current visit count from localStorage
        let visits = localStorage.getItem('gameVisits') || 0;
        visits = parseInt(visits) + 1;
        
        // Update localStorage
        localStorage.setItem('gameVisits', visits);
        
        // Update the counter in the UI
        document.getElementById('visit-counter').textContent = visits;
    }
}

window.addEventListener('load', () => {
    new SecurityGame();
});