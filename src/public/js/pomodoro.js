/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************************!*\
  !*** ./resources/js/pomodoro.js ***!
  \**********************************/
document.addEventListener("DOMContentLoaded", function () {
  var timerElement = document.getElementById('timer');
  var startPauseButton = document.getElementById('start-pause');
  var resetButton = document.getElementById('reset');
  var progressBar = document.getElementById('progress_bar');
  var textareaField = document.getElementById("textarea_field");
  var addTaskButton = document.getElementById("add_task_button");
  var todoTask = document.getElementById("todo_task");
  var doneTask = document.getElementById("done_task");

  // const WORK_DURATION = 1500; // 25分を秒単位で表したもの
  var WORK_DURATION = 5; // 25分を秒単位で表したもの
  // const SHORT_BREAK_DURATION = 300; // 5分を秒単位で表したもの
  var SHORT_BREAK_DURATION = 3; // 5分を秒単位で表したもの
  // const LONG_BREAK_DURATION = 1500; // 25分を秒単位で表したもの
  var LONG_BREAK_DURATION = 10; // 25分を秒単位で表したもの

  var workingComment = 'just do it';
  var breakingComment = 'just chill';
  var longbreakingComment = 'relaaax!';
  var timeLeft = WORK_DURATION;
  var rapperComment = workingComment;
  var timerState = 'work';
  var completedSets = 0;
  var timerRunning = false;
  var timerId;
  timerElement.textContent = formatTime(timeLeft);
  function updateTimerDisplay() {
    var displayTime = formatTime(timeLeft);
    timerElement.textContent = displayTime;
    document.title = displayTime;
  }
  function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return "".concat(minutes.toString().padStart(2, '0'), ":").concat(remainingSeconds.toString().padStart(2, '0'));
  }
  function updateRapperComment() {
    var rapperCommentElement = document.getElementById('rapper_comment');
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
    var percentage = Math.round(timeLeft / 1500 * 100);
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
    var emptyStar = document.querySelector('.nes-icon.star.is-empty');
    if (emptyStar) {
      emptyStar.classList.remove('is-empty');
    }
  }
  function resetStars() {
    var filledStars = document.querySelectorAll('.nes-icon.star:not(.is-empty)');
    filledStars.forEach(function (star) {
      star.classList.add('is-empty');
    });
  }
  function incrementPomodoroCount() {
    var pomodoroCountElement = document.getElementById('pomodoro_count');
    var currentCount = parseInt(pomodoroCountElement.textContent.split(':')[1]);
    pomodoroCountElement.textContent = "count:".concat(currentCount + 1);
  }
  startPauseButton.addEventListener('click', function () {
    if (timerRunning) {
      clearInterval(timerId);
      timerRunning = false;
      startPauseButton.textContent = 'START!!!';
    } else {
      timerRunning = true;
      startPauseButton.textContent = 'PAUSE';
      updateRapperComment();
      timerId = setInterval(function () {
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
          } else if (timerState === 'long_break') {
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
  resetButton.addEventListener('click', function () {
    if (!timerRunning) {
      resetTimer();
    }
  });

  // タスク管理
  function createMoveButtons(taskContainer) {
    var moveUpButton = document.createElement("img");
    var moveDownButton = document.createElement("img");
    var appElement = document.getElementById("todo_section");
    var upImageSrc = appElement.getAttribute("data-up-image");
    var downImageSrc = appElement.getAttribute("data-down-image");
    moveUpButton.src = upImageSrc;
    moveDownButton.src = downImageSrc;
    moveUpButton.className = "move-button";
    moveDownButton.className = "move-button";
    moveUpButton.addEventListener("click", function () {
      var previousSibling = taskContainer.previousElementSibling;
      if (previousSibling && previousSibling.className !== "title") {
        taskContainer.parentElement.insertBefore(taskContainer, previousSibling);
      }
    });
    moveDownButton.addEventListener("click", function () {
      var nextSibling = taskContainer.nextElementSibling;
      if (nextSibling) {
        taskContainer.parentElement.insertBefore(nextSibling, taskContainer);
      }
    });
    return {
      moveUpButton: moveUpButton,
      moveDownButton: moveDownButton
    };
  }
  function createDeleteButton(taskContainer) {
    var deleteButton = document.createElement("img");
    var appElement = document.getElementById("todo_section");
    var deleteImageSrc = appElement.getAttribute("data-delete-image");
    deleteButton.src = deleteImageSrc;
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", function () {
      taskContainer.remove(); // taskContainerを削除
    });

    return deleteButton;
  }
  function createTaskElement(taskText) {
    var taskContainer = document.createElement("div");
    taskContainer.className = "task-container";
    var newTaskLabel = document.createElement("label");
    newTaskLabel.className = "task-label";
    var newTaskCheckbox = document.createElement("input");
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
    var newTaskSpan = document.createElement("span");
    newTaskSpan.textContent = taskText;
    var deleteButton = createDeleteButton(taskContainer);
    var moveButtons = createMoveButtons(taskContainer);
    newTaskLabel.appendChild(newTaskCheckbox);
    newTaskLabel.appendChild(newTaskSpan);
    taskContainer.appendChild(moveButtons.moveUpButton);
    taskContainer.appendChild(moveButtons.moveDownButton);
    taskContainer.appendChild(deleteButton);
    taskContainer.appendChild(newTaskLabel);
    return taskContainer;
  }
  addTaskButton.addEventListener("click", function () {
    var taskText = textareaField.value.trim();
    if (taskText === "") {
      alert("Please enter a task.");
      return;
    }
    var taskElement = createTaskElement(taskText);
    todoTask.appendChild(taskElement);
    textareaField.value = "";
  });

  // 初期表示
  updateTimerDisplay();
  updateProgressBar();
});
/******/ })()
;