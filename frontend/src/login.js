window.onload = function () {
    const userId = localStorage.getItem("userSession");

    if (userId) {
        window.location.href = "dashboard.html";
    }

    const submitUserBtn = document.getElementById("submitUser");
    submitUserBtn.onclick = handleUsernameSubmit;
};

document.getElementById("username").addEventListener("input", function () {
    const userErrorText = document.getElementById("userError");
    userErrorText.classList.add("hidden");
});

const handleUsernameSubmit = function (event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username");
    const username = usernameInput.value.trim();

    if (!username == "") {
        getUserData(username);
    } else {
        const userErrorText = document.getElementById("userError");
        userErrorText.classList.remove("hidden");
    }

    usernameInput.value = "";
};

const getUserData = async function (username) {
    const url = `http://127.0.0.1:3000/api/v1/users/username/${username}`;

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

        const json = await response.json();
        console.log(json);
        const data = json.data;

        localStorage.setItem("userSession", data.id);

        window.location.href = "dashboard.html";

        return data;
    } catch (error) {
        console.error(error.message);

        await handleUserCreate(username);
    }
};

const handleUserCreate = async function (username) {
    const url = `http://127.0.0.1:3000/api/v1/users`;

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ username: username }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        const data = json.data;

        localStorage.setItem("userSession", data.id);

        window.location.href = "dashboard.html";
        return data;
    } catch (error) {
        console.error(error.message);
    }
};
