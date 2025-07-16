import {API_BASE_URL} from "./dataProvider";

const authProvider = {
    // Called when the user attempts to log in
    login: async ({ username, password }) => {
        const request = new Request(API_BASE_URL + "/auth/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: new Headers({ "Content-Type": "application/json" }),
        });

        const response = await fetch(request);
        if (!response.ok) throw new Error("Invalid credentials");

        const { token } = await response.json();
        localStorage.setItem("token", token); // Store JWT
        return Promise.resolve();
    },

    // Called when the user logs out
    logout: () => {
        localStorage.removeItem("token");
        return Promise.resolve();
    },

    // Called when the API needs authentication validation
    checkAuth: () => {
        const token = localStorage.getItem("token");

        if (!token) return Promise.reject();

        // Decode and check expiration (assuming token follows JWT format)
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem("token"); // Token expired, remove it
            return Promise.reject();
        }

        return Promise.resolve();
    },

    // Redirect user if they are not authenticated
    checkError: (error) => {
        if (error.status === 401 || error.status === 403) {
            localStorage.removeItem("token");
            return Promise.reject();
        }
        return Promise.resolve();
    },

    // Used to retrieve user's role/permissions
    getPermissions: () => Promise.resolve(),
};

export default authProvider;
