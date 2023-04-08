document.addEventListener("DOMContentLoaded", async function () {
    const textareaField = document.getElementById("textarea_field");
    const addTaskButton = document.getElementById("add_task_button");
    const todoTask = document.getElementById("todo_task");
    const doneTask = document.getElementById("done_task");

    // タスク管理
    async function getTasksFromServer() {
        const response = await fetch("/api/tasks/user", {
            credentials: 'same-origin',
        });

        if (!response.ok) {
            throw new Error("Error fetching tasks");
        }
        const tasks = await response.json();
        return tasks;
    }

    async function renderInitialTasks() {
        try {
            const tasks = await getTasksFromServer();
            tasks.forEach(task => {
                const taskElement = createTaskElement(task.task);
                if (task.is_done) {
                    doneTask.appendChild(taskElement);
                } else {
                    todoTask.appendChild(taskElement);
                }
            });
        } catch (error) {
            console.error("Error fetching tasks:", error);
            alert("Error fetching tasks from server. Please try again.");
        }
    }

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

    function initializeTaskListeners() {
        const taskContainers = document.querySelectorAll('.task-container');
        taskContainers.forEach(taskContainer => {
            const moveButtons = taskContainer.querySelectorAll('.move-button');

            // todo:↓の判定がないと、moveButtonsが存在しない場合にエラーが発生する
            // なぜ、存在しない場合が存在するかは不明なので後で調査(必要なタスクは表示されるので機能には問題ないと判断)
            // console.log(moveButtons);
            if (moveButtons.length > 0) {
                const moveUpButton = moveButtons[0];
                const moveDownButton = moveButtons[1];
                const deleteButton = taskContainer.querySelector('.delete-button');
                const taskCheckbox = taskContainer.querySelector('input[type="checkbox"].nes-checkbox');

                moveUpButton.addEventListener('click', function() {
                    const previousSibling = taskContainer.previousElementSibling;
                    if (previousSibling && previousSibling.className !== 'title') {
                        taskContainer.parentElement.insertBefore(taskContainer, previousSibling);
                    }
                });

                moveDownButton.addEventListener('click', function() {
                    const nextSibling = taskContainer.nextElementSibling;
                    if (nextSibling) {
                        taskContainer.parentElement.insertBefore(nextSibling, taskContainer);
                    }
                });

                deleteButton.addEventListener('click', function() {
                    taskContainer.remove();
                });

                taskCheckbox.addEventListener('change', function() {
                    if (this.checked) {
                        doneTask.appendChild(taskContainer);
                    } else {
                        todoTask.appendChild(taskContainer);
                    }
                });
            }else{
                console.error('Move buttons not found');
                return;
            }
        });
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
        // taskContainer.setAttribute("data-task-id", taskId);

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
        taskContainer.appendChild(newTaskLabel);
        taskContainer.appendChild(deleteButton);

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

    // 初期表示のタスクをレンダリング
    await renderInitialTasks();
});
