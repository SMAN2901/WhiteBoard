import http from "../services/httpService";
import { getEndpointUrl, jsonToFormdata, formatTags } from "./ApiUtility";
import { getAuthHeader } from "./AuthApi";

export async function getPosts() {
    const apiEndpoint = getEndpointUrl("blog") + "posts/";
    const config = getAuthHeader();

    var { data } = await http.get(apiEndpoint, config);

    return data;
}

export async function getPost(id) {
    const apiEndpoint = getEndpointUrl("blog") + "posts/" + id + "/";
    const config = getAuthHeader();

    var { data } = await http.get(apiEndpoint, config);
    if (data === {}) data = null;

    return data;
}

export async function getUserPosts(id) {
    if (id === null) return [];

    const apiEndpoint = getEndpointUrl("blog") + id + "/posts/";
    const config = getAuthHeader();

    var { data } = await http.get(apiEndpoint, config);

    return data;
}

export async function getPostComments(id) {
    const apiEndpoint = getEndpointUrl("blog") + "posts/" + id + "/comments/";
    const config = getAuthHeader();

    var { data } = await http.get(apiEndpoint, config);

    return data;
}

export async function likePost(id) {
    const apiEndpoint = getEndpointUrl("blog") + "posts/" + id + "/like-req/";
    const config = getAuthHeader();

    await http.get(apiEndpoint, config);
}

export async function postComment(id, data) {
    const apiEndpoint = getEndpointUrl("blog") + "posts/" + id + "/comments/";
    const config = getAuthHeader();

    await http.post(apiEndpoint, data, config);
}

export async function createPost(data, banner) {
    const apiEndpoint = getEndpointUrl("blog") + "create-post/";
    const config = getAuthHeader();

    data.tags = formatTags(data.tags);
    data = jsonToFormdata(data, banner, "banner");
    const response = await http.post(apiEndpoint, data, config);

    return response.data;
}
