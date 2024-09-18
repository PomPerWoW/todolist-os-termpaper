window.onload = function () {
    const userId = localStorage.getItem("userSession");

    if (!userId) {
        window.location.href = "login.html";
        return;
    }

    loadData(userId);
};

const loadData = async function (userId) {
    const usernameField = document.getElementById("username");

    const data = await getUserData(userId);

    if (!data) {
        return;
    }

    const username = data.username;
    usernameField.innerHTML = `${username}'s Todo`;

    const tasks = data.tasks;
    if (tasks.length) {
        for (let i = 0; i < tasks.length; i++) {
            console.log(tasks[i]);
            const task = tasks[i];
            createLists(task.id, task.task_title, task.completed);
        }
    }
};

const changeTaskData = async function (taskId, taskCompleted, taskName = null) {
    if (!taskName && typeof taskCompleted === "undefined") {
        return;
    }

    const url = `http://127.0.0.1:3000/api/v1/tasks/${taskId}`;

    const bodyData = {};
    if (taskName) bodyData.task_title = taskName;
    if (typeof taskCompleted !== "undefined")
        bodyData.completed = taskCompleted;

    try {
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(bodyData),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const res = await response.json();
        const data = res.data;
        console.log(data);

        return data;
    } catch (error) {
        console.error(error.message);
    }
};

const handleCompleteTask = async function (event) {
    const checkboxId = event.target.id;
    const formId = event.target.closest("form").id;
    const formChecked = document.getElementById(formId);

    const taskId = checkboxId.split("-")[1];
    const taskTitle = document.getElementById(`taskTitle-${taskId}`);

    if (event.target.checked) {
        console.log(`CheckBox ${checkboxId} in form ${formId} is checked`);

        await changeTaskData(taskId, true);

        formChecked.classList.remove("bg-opacity-85");
        formChecked.classList.add("bg-opacity-60");

        taskTitle.classList.add(
            "line-through",
            "decoration-sky-700",
            "decoration-[3px]"
        );
    } else {
        await changeTaskData(taskId, false);

        console.log(`CheckBox ${checkboxId} in form ${formId} is unchecked`);
        formChecked.classList.remove("bg-opacity-60");
        formChecked.classList.add("bg-opacity-85");

        taskTitle.classList.remove(
            "line-through",
            "decoration-sky-700",
            "decoration-[3px]"
        );
    }
};

const deleteTask = async function (event) {
    const deleteId = event.target.id;
    const formId = event.target.closest("form").id;
    const formToRemove = document.getElementById(formId);
    const formLists = document.getElementById("todo-lists");

    const taskId = deleteId.split("-")[1];

    if (event.target) {
        console.log(`DeleteBox ${deleteId} in form ${formId} is checked`);

        const url = `http://127.0.0.1:3000/api/v1/tasks/${taskId}`;

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            formLists.removeChild(formToRemove);
            console.log(`Form ${formId} removed from todo-lists`);
        } catch (error) {
            console.error(error.message);
        }
    } else {
        console.log(`DeleteBox ${deleteId} in form ${formId} is unchecked`);
    }
};

const createLists = function (taskId, taskName, taskCompleted) {
    const formLists = document.getElementById("todo-lists");
    const form = document.createElement("form");
    form.id = `task-${taskId}`;
    form.className =
        "px-12 py-8 bg-slate-100 rounded-2xl flex items-center justify-between gap-8";

    if (taskCompleted) {
        form.classList.add("bg-opacity-60");
    } else {
        form.classList.add("bg-opacity-85");
    }

    const titleDiv = document.createElement("div");
    titleDiv.className = "w-80";

    const titleH3 = document.createElement("h3");
    titleH3.id = `taskTitle-${taskId}`;
    titleH3.className = "text-2xl font-semibold text-sky-700";

    if (taskCompleted) {
        titleH3.classList.add(
            "line-through",
            "decoration-sky-700",
            "decoration-[3px]"
        );
    } else {
        titleH3.classList.remove(
            "line-through",
            "decoration-sky-700",
            "decoration-[3px]"
        );
    }

    titleH3.textContent = taskName;

    titleDiv.appendChild(titleH3);

    const additionalDiv = document.createElement("div");
    additionalDiv.className = "flex justify-center items-center gap-4";

    const checkboxWrapperDiv = document.createElement("div");
    checkboxWrapperDiv.className =
        "checkbox-wrapper flex items-center justify-center";

    const checkboxRelativeDiv = document.createElement("div");
    checkboxRelativeDiv.className = "relative";

    const checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.id = `checkbox-${taskId}`;
    checkboxInput.className = "peer hidden";
    checkboxInput.onchange = handleCompleteTask;

    if (taskCompleted) {
        checkboxInput.checked = true;
    } else {
        checkboxInput.checked = false;
    }

    const checkboxLabel = document.createElement("label");
    checkboxLabel.setAttribute("for", `checkbox-${taskId}`);
    checkboxLabel.className =
        "block h-7 w-7 rounded-full border border-gray-400 cursor-pointer bg-white peer-checked:bg-sky-500 peer-checked:border-sky-500 relative";

    const checkboxSpan = document.createElement("span");
    checkboxSpan.className =
        "absolute h-[6px] w-[12px] border-[2px] border-white border-t-0 border-r-0 left-[8px] top-[9px] rotate-[-45deg] opacity-0 opacity-100 transition-opacity duration-200";

    checkboxLabel.appendChild(checkboxSpan);
    checkboxRelativeDiv.appendChild(checkboxInput);
    checkboxRelativeDiv.appendChild(checkboxLabel);
    checkboxWrapperDiv.appendChild(checkboxRelativeDiv);

    const deleteIconDiv = document.createElement("div");
    deleteIconDiv.className = "relative w-5 h-5 cursor-pointer";
    deleteIconDiv.id = `deleteBox-${taskId}`;
    deleteIconDiv.onclick = deleteTask;

    const deleteIconLine1 = document.createElement("span");
    deleteIconLine1.className =
        "absolute top-1/2 left-0 right-0 h-0.5 bg-sky-700 rounded transform rotate-45";

    const deleteIconLine2 = document.createElement("span");
    deleteIconLine2.className =
        "absolute top-1/2 left-0 right-0 h-0.5 bg-sky-700 rounded transform -rotate-45";

    deleteIconDiv.appendChild(deleteIconLine1);
    deleteIconDiv.appendChild(deleteIconLine2);

    additionalDiv.appendChild(checkboxWrapperDiv);
    additionalDiv.appendChild(deleteIconDiv);

    form.appendChild(titleDiv);
    form.appendChild(additionalDiv);

    formLists.appendChild(form);
};

const handleCreateTaskSubmit = async function (event) {
    event.preventDefault();

    const taskNameInput = document.getElementById("taskName");
    const userId = localStorage.getItem("userSession");

    const task = await createTask(taskNameInput.value, userId);
    createLists(task.id, task.task_title, task.completed);

    taskNameInput.value = "";
};

const getUserData = async function (userId) {
    const url = `http://127.0.0.1:3000/api/v1/users/${userId}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const res = await response.json();
        const data = res.data;
        console.log(data);

        return data;
    } catch (error) {
        console.error(error.message);
    }
};

const createTask = async function (taskName, userId) {
    const url = `http://127.0.0.1:3000/api/v1/tasks`;

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ task_title: taskName, user_id: userId }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const res = await response.json();
        const data = res.data;
        console.log(data);

        return data;
    } catch (error) {
        console.error(error.message);
    }
};

const logOut = function () {
    localStorage.removeItem("userSession");
    window.location.href = "login.html";
};

document.getElementById("logoutBtn").addEventListener("click", logOut);
