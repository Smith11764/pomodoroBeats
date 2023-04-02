document.addEventListener("DOMContentLoaded", function () {
    const timerElement = document.getElementById('timer');

    const startPauseButton = document.getElementById('start-pause');
    const resetButton = document.getElementById('reset');

    const progressBar = document.getElementById('progress_bar');
    const textareaField = document.getElementById("textarea_field");
    const addTaskButton = document.getElementById("add_task_button");
    const todoTask = document.getElementById("todo_task");
    const doneTask = document.getElementById("done_task");

    // const WORK_DURATION = 1500; // 25分を秒単位で表したもの
    const WORK_DURATION = 5; // 25分を秒単位で表したもの
    // const SHORT_BREAK_DURATION = 300; // 5分を秒単位で表したもの
    const SHORT_BREAK_DURATION = 3; // 5分を秒単位で表したもの
    // const LONG_BREAK_DURATION = 1500; // 25分を秒単位で表したもの
    const LONG_BREAK_DURATION = 10; // 25分を秒単位で表したもの

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

    // タスク管理
    function createMoveButtons(taskContainer) {
        const moveUpButton = document.createElement("img");
        const moveDownButton = document.createElement("img");
        const appElement = document.getElementById("todo_section");
        const upImageSrc = appElement.getAttribute("data-up-image");
        const downImageSrc = appElement.getAttribute("data-down-image");
        moveUpButton.src = upImageSrc;
        moveDownButton.src = downImageSrc;
        moveUpButton.className = "move-button";
        moveDownButton.className = "move-button";

        moveUpButton.addEventListener("click", function () {
            const previousSibling = taskContainer.previousElementSibling;
            if (previousSibling && previousSibling.className !== "title") {
                taskContainer.parentElement.insertBefore(taskContainer, previousSibling);
            }
        });

        moveDownButton.addEventListener("click", function () {
            const nextSibling = taskContainer.nextElementSibling;
            if (nextSibling) {
                taskContainer.parentElement.insertBefore(nextSibling, taskContainer);
            }
        });

        return { moveUpButton, moveDownButton };
    }

    function createDeleteButton(taskContainer) {
        const deleteButton = document.createElement("img");
        const appElement = document.getElementById("todo_section");
        const deleteImageSrc = appElement.getAttribute("data-delete-image");
        deleteButton.src = deleteImageSrc;
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", function () {
            taskContainer.remove(); // taskContainerを削除
        });
        return deleteButton;
    }

    function createTaskElement(taskText) {
        const taskContainer = document.createElement("div");
        taskContainer.className = "task-container";

        const newTaskLabel = document.createElement("label");
        newTaskLabel.className = "task-label";
        const newTaskCheckbox = document.createElement("input");
        newTaskCheckbox.type = "checkbox";
        newTaskCheckbox.className = "nes-checkbox is-dark";

        // チェックボックスがチェックされたとき
        newTaskCheckbox.addEventListener("change", function () {
            if (this.checked) {
                doneTask.appendChild(taskContainer);
            } else {
                todoTask.appendChild(taskContainer);
            }
        });

        const newTaskSpan = document.createElement("span");
        newTaskSpan.textContent = taskText;

        const deleteButton = createDeleteButton(taskContainer);
        const moveButtons = createMoveButtons(taskContainer);

        newTaskLabel.appendChild(newTaskCheckbox);
        newTaskLabel.appendChild(newTaskSpan);

        taskContainer.appendChild(moveButtons.moveUpButton);
        taskContainer.appendChild(moveButtons.moveDownButton);
        taskContainer.appendChild(deleteButton);
        taskContainer.appendChild(newTaskLabel);

        return taskContainer;
    }

    addTaskButton.addEventListener("click", function () {
        const taskText = textareaField.value.trim();
        if (taskText === "") {
            alert("Please enter a task.");
            return;
        }

        const taskElement = createTaskElement(taskText);
        todoTask.appendChild(taskElement);

        textareaField.value = "";
    });

    // 初期表示
    updateTimerDisplay();
    updateProgressBar();
});
