import jwtDecode from "jwt-decode";
import http from "../services/httpService";
import config from "../config.json";

export async function signup(user) {
    const apiEndpoint = config.apiUrl + "/signup";
    const respone = await http.post(apiEndpoint, user);
    return respone;
}

export async function login(user) {
    const apiEndpoint = config.apiUrl + "/login";
    const response = await http.post(apiEndpoint, user);
    return response;
}

export async function getCurrentUser() {
    try {
        const token = localStorage.getItem("token");

        if (token) {
            const data = jwtDecode(token);
            const apiEndpoint =
                config.apiUrl + "/users/" + data.username + ".json";
            const response = await http.get(apiEndpoint);
            return response.data;
        } else return null;
    } catch (ex) {
        return null;
    }
}
