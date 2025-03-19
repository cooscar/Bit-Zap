let points = parseInt(localStorage.getItem('points')) || 0;
let completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || {};

function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `Points: ${points}`;
    }
}

function updateLevelButtons() {
    document.querySelectorAll('.level-grid button').forEach(button => {
        let level = button.getAttribute('onclick').match(/'(.*?)'/)[1]; 
        if (completedLevels[level]) {
            button.classList.add("completed");

            button.disabled = false; 
        }
    });
}

function completeLevel(levelName) {
    if (!completedLevels[levelName]) { 
        completedLevels[levelName] = true;
        points += 10;
        localStorage.setItem('points', points);
        localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateScoreDisplay();
    updateLevelButtons();
});
