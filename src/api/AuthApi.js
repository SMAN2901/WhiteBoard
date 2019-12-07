import jwtDecode from "jwt-decode";
import http from "../services/httpService";
import { getEndpointUrl } from "./ApiUtility";

export async function signup(user) {
    const apiEndpoint = getEndpointUrl("signup");
    const response = await http.post(apiEndpoint, user);
    return response.data;
}

export async function login(user) {
    const apiEndpoint = getEndpointUrl("login");
    const response = await http.post(apiEndpoint, user);
    return response;
}

export function logout() {
    if (isAuthenticated()) {
        removeAuthToken();
    }
}

export function removeAuthToken() {
    localStorage.removeItem("token");
}

export function getAuthToken() {
    const token = localStorage.getItem("token");
    return token;
}

export function getAuthHeader() {
    const token = getAuthToken();
    if (!token) return {};
    var config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`
        }
    };

    return config;
}

export function getCurrentUser() {
    try {
        const token = getAuthToken();

        if (token) {
            const data = jwtDecode(token);
            return data;
        } else return null;
    } catch (ex) {
        return null;
    }
}

export function isAuthenticated() {
    return getCurrentUser() ? true : false;
}
