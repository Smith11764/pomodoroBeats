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
                const taskElement = createTaskElement(task.task, task.id, task.is_done);
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
        deleteButton.addEventListener("click", async function () {
            taskContainer.remove(); // taskContainerを削除

            // タスク削除APIを呼び出す
            try {
                const taskId = taskContainer.getAttribute('data-task-id');
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'DELETE',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error deleting task');
                }
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Error deleting task. Please try again.');
            }
        });
        return deleteButton;
    }

    function createTaskElement(taskText, taskId, isDone = false) {
        const taskContainer = document.createElement("div");
        taskContainer.className = "task-container";
        taskContainer.setAttribute("data-task-id", taskId);

        const newTaskLabel = document.createElement("label");
        newTaskLabel.className = "task-label";
        const newTaskCheckbox = document.createElement("input");
        newTaskCheckbox.type = "checkbox";
        newTaskCheckbox.className = "nes-checkbox is-dark";

        if (isDone) {
            newTaskCheckbox.checked = true;
        }

        // チェックボックスがチェックされたとき
        newTaskCheckbox.addEventListener("change", async function () {
            const isChecked = this.checked;
            if (isChecked) {
                doneTask.appendChild(taskContainer);
            } else {
                todoTask.appendChild(taskContainer);
            }
            // タスク更新APIを呼び出す
            try {
                const taskId = taskContainer.getAttribute('data-task-id');
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'PUT',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    },
                    body: JSON.stringify({
                        is_done: isChecked,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Error updating task');
                }
            } catch (error) {
                console.error('Error updating task:', error);
                alert('Error updating task. Please try again.');
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

    addTaskButton.addEventListener("click", async function () {
        const taskText = textareaField.value.trim();
        if (taskText === "") {
            alert("Please enter a task.");
            return;
        }

        const taskElement = createTaskElement(taskText);
        todoTask.appendChild(taskElement);

        textareaField.value = "";
        // タスク追加APIを呼び出す
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    task: taskText,
                    is_done: false,
                }),
            });

            if (!response.ok) {
                throw new Error('Error adding task');
            }

            const taskData = await response.json();
            taskElement.setAttribute('data-task-id', taskData.id);
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Error adding task. Please try again.');
        }
    });

    // 初期表示のタスクをレンダリング
    await renderInitialTasks();
});
