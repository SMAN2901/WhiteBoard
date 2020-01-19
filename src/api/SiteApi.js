import http from "../services/httpService";
import { getEndpointUrl } from "./ApiUtility";
import { getAuthHeader } from "./AuthApi";

export async function getSiteInfo() {
    const apiEndpoint = getEndpointUrl("siteInfo");
    const config = getAuthHeader();

    try {
        var { data } = await http.get(apiEndpoint, config);
        return data;
    } catch (ex) {
        return null;
    }
}
