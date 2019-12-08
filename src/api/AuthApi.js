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

export function storeAuthToken(token) {
    localStorage.setItem("token", token);
    localStorage.setItem("tokenCreated", Date.now());
}

export function logout() {
    removeAuthToken();
}

export function removeAuthToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenCreated");
}

export async function refreshAuthToken() {
    const token = getAuthToken();
    if (token) {
        const apiEndpoint = getEndpointUrl("refreshToken");
        const data = { token: token };

        try {
            const response = await http.post(apiEndpoint, data);
            const refreshedToken = response.data.token;
            storeAuthToken(refreshedToken);
        } catch (ex) {}
    }
}

export async function checkAuthToken() {
    if (getAuthToken()) refreshAuthToken();
    else removeAuthToken();
}

export function authTokenExpired(token, tokenCreated) {
    if (token && tokenCreated) {
        try {
            const currentTime = Date.now();
            const { exp, orig_iat } = jwtDecode(token);
            const tokenCreated = localStorage.getItem("tokenCreated");
            const delta = tokenCreated - orig_iat * 1000;
            const expireTime = exp * 1000 + delta;
            const minDiff = 24 * 60 * 60 * 1000;

            if (expireTime - currentTime < minDiff) return true;
            else return false;
        } catch (ex) {
            removeAuthToken();
            return true;
        }
    }
    return true;
}

export function getAuthToken() {
    const token = localStorage.getItem("token");
    const tokenCreated = localStorage.getItem("tokenCreated");

    if (token && tokenCreated) {
        if (!authTokenExpired(token, tokenCreated)) return token;
    }

    removeAuthToken();
    return null;
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
        const data = token ? jwtDecode(token) : null;
        return data;
    } catch (ex) {
        removeAuthToken();
        return null;
    }
}

export function isAuthenticated() {
    if (getCurrentUser()) return true;
    return false;
}
