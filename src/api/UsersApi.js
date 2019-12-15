import http from "../services/httpService";
import { getAuthHeader, getCurrentUser } from "./AuthApi";
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

export async function updateProfileImage(image) {
    const user = getCurrentUser();
    if (user === null) return null;

    try {
        const apiEndpoint =
            getEndpointUrl("users") + user.username + "/pic-update/";
        var form_data = new FormData();
        form_data.append("profile_pic", image);
        var config = getAuthHeader();

        var { data } = await http.put(apiEndpoint, form_data, config);
        return data;
    } catch (ex) {
        throw ex;
    }
}
