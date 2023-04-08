document.addEventListener("DOMContentLoaded", async function () {
    const timerElement = document.getElementById('timer');
    const startPauseButton = document.getElementById('start-pause');
    const resetButton = document.getElementById('reset');
    const progressBar = document.getElementById('progress_bar');

    // const WORK_DURATION = 1500; // 25分を秒単位で表したもの
    const WORK_DURATION = 5; // test
    // const SHORT_BREAK_DURATION = 300; // 5分を秒単位で表したもの
    const SHORT_BREAK_DURATION = 3; // test
    // const LONG_BREAK_DURATION = 1500; // 25分を秒単位で表したもの
    const LONG_BREAK_DURATION = 10; // test

    const workingComment = 'just do it';
    const breakingComment = 'just chill';
    const longbreakingComment = 'relaaax!';

    let timeLeft = WORK_DURATION;
    let rapperComment = workingComment
    let timerState = 'work';
    let completedSets = 0;
    let timerRunning = false;
    let timerId;

    timerElement.textContent = formatTime(timeLeft);

    function updateTimerDisplay() {
        const displayTime = formatTime(timeLeft);
        timerElement.textContent = displayTime;
        document.title = displayTime;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function updateRapperComment() {
        const rapperCommentElement = document.getElementById('rapper_comment');
        rapperCommentElement.textContent = rapperComment;
    }

    function resetTimer() {
        if (timerState === 'work') {
            timeLeft = WORK_DURATION;
            rapperComment = workingComment;
        } else if (timerState === 'short_break') {
            timeLeft = SHORT_BREAK_DURATION;
            rapperComment = breakingComment;
        } else if (timerState === 'long_break') {
            timeLeft = LONG_BREAK_DURATION;
            rapperComment = longbreakingComment;
        }
        updateTimerDisplay();
        updateProgressBar();
    }

    function updateProgressBar() {
        const percentage = Math.round(timeLeft / 1500 * 100);
        if (percentage < 50 && percentage > 30) {
            progressBar.classList.remove('is-primary');
            progressBar.classList.add('is-success');
        } else if (percentage <= 30 && percentage >= 10) {
            progressBar.classList.remove('is-success');
            progressBar.classList.add('is-warning');
        } else if (percentage < 10) {
            progressBar.classList.remove('is-warning');
            progressBar.classList.add('is-error');
        }
        progressBar.value = percentage;
    }

    function incrementStars() {
        const emptyStar = document.querySelector('.nes-icon.star.is-empty');
        if (emptyStar) {
            emptyStar.classList.remove('is-empty');
        }
    }

    function resetStars() {
        const filledStars = document.querySelectorAll('.nes-icon.star:not(.is-empty)');
        filledStars.forEach(star => {
            star.classList.add('is-empty');
        });
    }

    function incrementPomodoroCount() {
        const pomodoroCountElement = document.getElementById('pomodoro_count');
        const currentCount = parseInt(pomodoroCountElement.textContent.split(':')[1]);
        pomodoroCountElement.textContent = `count:${currentCount + 1}`;
    }

    startPauseButton.addEventListener('click', () => {
        if (timerRunning) {
            clearInterval(timerId);
            timerRunning = false;
            startPauseButton.textContent = 'START!!!';
        } else {
            timerRunning = true;
            startPauseButton.textContent = 'PAUSE';
            updateRapperComment();
            timerId = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                updateProgressBar();
                if (timeLeft === 0) {
                    if (timerState === 'work') {
                        completedSets++;
                        incrementStars();
                        if (completedSets === 4) {
                            timerState = 'long_break';
                            completedSets = 0;
                        } else {
                            timerState = 'short_break';
                        }
                    } else if(timerState === 'long_break'){
                        incrementPomodoroCount();
                        resetStars();
                        timerState = 'work';
                    } else {
                        timerState = 'work';
                    }

                    clearInterval(timerId);
                    timerRunning = false;
                    startPauseButton.textContent = 'START!!!';
                    resetTimer();
                    updateRapperComment();
                }
            }, 1000);
        }
    });

    resetButton.addEventListener('click', () => {
        if (!timerRunning) {
            resetTimer();
        }
    });

    // 初期表示
    updateTimerDisplay();
    updateProgressBar();
});
