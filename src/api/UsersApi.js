import http from "../services/httpService";
import { getAuthHeader } from "./AuthApi";
import { getEndpointUrl } from "./ApiUtility";

export async function getUserData(username) {
    if (!username) return null;
    try {
        const apiEndpoint = getEndpointUrl("users") + username + "/";
        var config = getAuthHeader();
        const response = await http.get(apiEndpoint, config);
        //console.log(response);
        return response.data;
    } catch (ex) {
        return null;
    }
}
