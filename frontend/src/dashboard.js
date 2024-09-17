// document.getElementById("username").addEventListener("input", function () {
//     const userNotFoundError = document.getElementById("userNotFound");
//     userNotFoundError.classList.add("hidden");
// });

// const handleUsernameSubmit = function (event) {
//     event.preventDefault();

//     const usernameInput = document.getElementById("username");

//     getUserData(usernameInput.value);

//     username.value = "";
// };

// const getUserData = async function (username) {
//     const url = `http://127.0.0.1:5000/api/v1/users/username/${username}`;

//     try {
//         const response = await fetch(url, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });

//         if (!response.ok) {
//             throw new Error(`Response status: ${response.status}`);
//         }

//         const json = await response.json();
//         console.log(json);

//         window.location.href = "dashboard.html";
//     } catch (error) {
//         console.error(error.message);

//         const userNotFoundError = document.getElementById("userNotFound");

//         userNotFoundError.classList.remove("hidden");
//     }
// };

const logOut = function () {
    localStorage.removeItem("userSession");
    window.location.href = "login.html";
};

document.getElementById("logoutBtn").addEventListener("click", logOut);
