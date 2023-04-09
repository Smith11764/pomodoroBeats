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

            // タスクをorder順にソート
            tasks.sort((a, b) => a.order - b.order);

            tasks.forEach(task => {
                const taskElement = createTaskElement(task.task, task.id, task.is_done, task.order);
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

    async function updateTaskOrder(taskContainer, siblingTaskContainer) {
        const taskId = taskContainer.getAttribute('data-task-id');
        const siblingTaskId = siblingTaskContainer.getAttribute('data-task-id');

        try {
            const response = await fetch(`/api/tasks/${taskId}/update_order`, {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    sibling_task_id: siblingTaskId,
                }),
            });

            if (!response.ok) {
                throw new Error('Error updating task order');
            }
        } catch (error) {
            console.error('Error updating task order:', error);
            alert('Error updating task order. Please try again.');
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

        moveUpButton.addEventListener("click", async function () {
            const previousSibling = taskContainer.previousElementSibling;
            if (previousSibling && previousSibling.className !== "title") {
                taskContainer.parentElement.insertBefore(taskContainer, previousSibling);

                // タスク順序を更新
                await updateTaskOrder(taskContainer, previousSibling);
            }
        });

        moveDownButton.addEventListener("click", async function () {
            const nextSibling = taskContainer.nextElementSibling;
            if (nextSibling) {
                taskContainer.parentElement.insertBefore(nextSibling, taskContainer);

                // タスク順序を更新
                await updateTaskOrder(taskContainer, nextSibling);
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

    function createTaskElement(taskText, taskId, isDone = false, order = 0) {
        const taskContainer = document.createElement("div");
        taskContainer.className = "task-container";
        taskContainer.setAttribute("data-task-id", taskId);
        taskContainer.setAttribute("data-order", order);

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
                const response = await fetch(`/api/tasks/${taskId}/update_check`, {
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
                    throw new Error('Error updating task is done');
                }
            } catch (error) {
                console.error('Error updating task is done:', error);
                alert('Error updating task is done. Please try again.');
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

            // createTaskElement関数でtaskData.idを使用して属性を設定する
            const taskElement = createTaskElement(taskText, taskData.id, false);
            todoTask.appendChild(taskElement);

            taskElement.setAttribute('data-task-id', taskData.id);
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Error adding task. Please try again.');
        }
    });

    // 初期表示のタスクをレンダリング
    await renderInitialTasks();
});
