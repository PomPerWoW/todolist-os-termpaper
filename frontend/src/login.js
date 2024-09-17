window.onload = function () {
    const userId = localStorage.getItem("userSession");

    getUserData(userId, true);

    if (userId) {
        window.location.href = "dashboard.html";
    }
};

document.getElementById("username").addEventListener("input", function () {
    const userNotFoundError = document.getElementById("userNotFound");
    userNotFoundError.classList.add("hidden");
});

const handleUsernameSubmit = function (event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username");

    getUserData(usernameInput.value);

    username.value = "";
};

const getUserData = async function (username, onLoad = false) {
    const url = `http://127.0.0.1:5000/api/v1/users/username/${username}`;

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

        localStorage.setItem("userSession", json.data.id);

        window.location.href = "dashboard.html";
    } catch (error) {
        console.error(error.message);

        if (!onLoad) {
            const userNotFoundError = document.getElementById("userNotFound");
            userNotFoundError.classList.remove("hidden");
        }
    }
};
