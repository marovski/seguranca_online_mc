// Add this method outside the class to make it globally accessible
function shareResult(platform) {
    // Get the game instance (assuming it's the most recently created instance)
    const gameInstances = window.securityGameInstances || [];
    const lastGameInstance = gameInstances[gameInstances.length - 1];
    
    if (lastGameInstance) {
        lastGameInstance.shareResult(platform);
    }
}

class SecurityGame {
    constructor() {
        this.currentLevel = 0;
        this.score = 0;
        this.levels = this.getLevels();

        // Track game instances globally
        window.securityGameInstances = window.securityGameInstances || [];
        window.securityGameInstances.push(this);

        this.initializeGame();
        this.updateVisitCounter();

        // Add event listeners for share buttons
        this.addShareButtonListeners();
    }

    getLevels() {
        return [
            {
                title: "Criação de Palavras-passe Fortes",
                type: "password",
                description: "Selecione a palavra-passe mais segura:",
                options: [
                    { text: "password123", correct: false },
                    { text: "MinhaDataNascimento1990", correct: false },
                    { text: "K9$mP#2@vL5nX", correct: true },
                    { text: "qwerty", correct: false }
                ],
                feedback: {
                    success: "Excelente! Uma palavra-passe forte combina letras maiúsculas e minúsculas, números e símbolos.",
                    failure: "Esta palavra-passe não é suficientemente segura. Tente utilizar uma combinação de caracteres diferentes."
                }
            },
            {
                title: "Autenticação de Dois Fatores",
                type: "2fa",
                description: "Qual é a melhor opção para configurar 2FA?",
                options: [
                    { text: "Utilizar apenas palavra-passe", correct: false },
                    { text: "SMS + palavra-passe", correct: false },
                    { text: "Aplicação autenticador + palavra-passe", correct: true },
                    { text: "Email de recuperação", correct: false }
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
                    { text: "suporte@bancodoportugal.pt - Atualização de segurança necessária", correct: false },
                    { text: "banco-portugal-urgente@mail.ru - O seu acesso foi bloqueado", correct: true },
                    { text: "newsletter@bancoportugal.pt - Relatório mensal", correct: false },
                    { text: "contacto@bancoportugal.pt - Confirmação de transferência", correct: false }
                ],
                feedback: {
                    success: "Correto! Emails de domínios suspeitos e mensagens urgentes são sinais comuns de phishing.",
                    failure: "Preste atenção ao domínio do email e ao tom urgente da mensagem."
                }
            },
            {
                title: "Atualizações de Dispositivos",
                type: "updates",
                description: "Qual é a melhor prática para manter o seu dispositivo seguro?",
                options: [
                    { text: "Ignorar todas as atualizações", correct: false },
                    { text: "Atualizar apenas quando for conveniente", correct: false },
                    { text: "Ativar atualizações automáticas", correct: true },
                    { text: "Atualizar apenas uma vez por ano", correct: false }
                ],
                feedback: {
                    success: "Correto! Manter o dispositivo atualizado ajuda a corrigir vulnerabilidades de segurança.",
                    failure: "As atualizações regulares são cruciais para proteger o seu dispositivo contra novas ameaças."
                }
            },
            {
                title: "Segurança em WiFi Público",
                type: "wifi",
                description: "Como se proteger ao Utilizar WiFi público?",
                options: [
                    { text: "Fazer login em todas as contas normalmente", correct: false },
                    { text: "Utilizar VPN e evitar transações sensíveis", correct: true },
                    { text: "Deixar o WiFi sempre ligado", correct: false },
                    { text: "Utilizar o mesmo WiFi sem cautela", correct: false }
                ],
                feedback: {
                    success: "Excelente! Uma VPN protege a sua conexão em redes públicas.",
                    failure: "Redes públicas podem ser inseguras. Tome precauções adicionais ao navegar."
                }
            }
        ];
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    initializeGame() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('continue-btn').addEventListener('click', () => this.hideModal());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
    }

    addShareButtonListeners() {
        document.getElementById('share-twitter')?.addEventListener('click', () => this.shareResult('twitter'));
        document.getElementById('share-whatsapp')?.addEventListener('click', () => this.shareResult('whatsapp'));
        document.getElementById('copy-link')?.addEventListener('click', () => this.shareResult('copy'));
    }

    startGame() {
        this.levels = this.shuffleArray(this.levels);
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
            "phishing": "📧",
            "updates": "🔄",
            "wifi": "📶"
        };

        document.getElementById('level-title').textContent = `${levelEmojis[level.type]} ${level.title}`;
        document.getElementById('progress').style.width = `${(this.currentLevel / this.levels.length) * 100}%`;

        // Shuffle the options for this level
        const shuffledOptions = this.shuffleArray([...level.options]);

        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = `
            <p>${level.description}</p>
            <div class="options">
                ${shuffledOptions.map(option => `
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
        this.levels = this.shuffleArray(this.levels);
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

    shareResult(platform) {
        const score = this.score;
        const shareText = `Completei a Aventura Segurança Online com ${score} pontos! Teste os seus conhecimentos de cibersegurança em https://marovski.github.io/seguranca_online_mc/`;
        const url = 'https://www.balai.cv/autores/mario-cardoso/dekodifika-tech-como-manter-se-seguro-online/';

        switch(platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(shareText).then(() => {
                    alert('Link copiado para a área de transferência!');
                });
                break;
        }
    }
}

window.addEventListener('load', () => {
    new SecurityGame();
});
