import http from "../services/httpService";
import { getEndpointUrl } from "./ApiUtility";
import { getAuthHeader, getCurrentUser } from "./AuthApi";

export async function getInboxData() {
    const { username } = getCurrentUser();
    const apiEndpoint = getEndpointUrl("users") + `${username}/inbox/`;
    const config = getAuthHeader();

    try {
        const { data } = await http.get(apiEndpoint, config);
        return data;
    } catch (ex) {
        throw ex;
    }
}

export async function getMessages(user) {
    const { username } = getCurrentUser();
    const apiEndpoint = getEndpointUrl("users") + `${username}/${user}/`;
    const config = getAuthHeader();

    try {
        const { data } = await http.get(apiEndpoint, config);
        return data;
    } catch (ex) {
        throw ex;
    }
}

export async function sendMessage(message) {
    const { username } = getCurrentUser();
    const apiEndpoint = getEndpointUrl("users") + `${username}/send-msg/`;
    const config = getAuthHeader();

    try {
        const { data } = await http.post(apiEndpoint, message, config);
        return data;
    } catch (ex) {
        throw ex;
    }
}
