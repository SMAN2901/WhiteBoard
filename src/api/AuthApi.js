import jwtDecode from "jwt-decode";
import http from "../services/httpService";
import { getEndpointUrl } from "./ApiUtility";
import packageJson from "../../package.json";

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

export function storeToken(token) {
    localStorage.setItem("token", token);
    localStorage.setItem("tokenVersion", packageJson.version);
}

export function isTokenUpdated() {
    const token = getAuthToken();
    if (token) {
        const currentVersion = localStorage.getItem("tokenVersion");
        if (currentVersion) {
            const latestVersion = packageJson.version;
            return latestVersion === currentVersion ? true : false;
        } else return false;
    } else return false;
}

export function logout() {
    if (isAuthenticated()) {
        removeAuthToken();
    }
}

export function removeAuthToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenVersion");
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
            if (!isTokenUpdated()) {
                removeAuthToken();
                return null;
            }
            const data = jwtDecode(token);
            return data;
        } else return null;
    } catch (ex) {
        return null;
    }
}

export function isAuthenticated() {
    if (getCurrentUser()) {
        if (isTokenUpdated()) return true;
        removeAuthToken();
        return false;
    }
    return false;
}
