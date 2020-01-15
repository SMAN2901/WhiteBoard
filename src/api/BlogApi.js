import http from "../services/httpService";
import { getEndpointUrl, jsonToFormdata, formatTags } from "./ApiUtility";
import { getAuthHeader } from "./AuthApi";

export const fakeBlogs = [
    {
        id: 0,
        title: "New era of AI",
        banner: "/assets/images/whiteboard_course.jpg",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        author: 1,
        tags: ["ai", "cse"],
        likes: 32,
        views: 59,
        comments: 12,
        date_created: "2020-01-12T14:01:18.895058Z",
        date_updated: "",
        author_info: {
            id: "7e537a30-90a2-4628-a6e5-6d4f06c4ff80",
            username: "sadman",
            name: "Sadman Rizwan",
            profile_pic:
                "https://98e20c85.ngrok.io/media/ProfilePic/sadman/boy-icon-png-10_7lCLr0R.jpg"
        }
    }
];

export async function getPosts() {
    const apiEndpoint = getEndpointUrl("blog") + "posts/";
    const config = getAuthHeader();

    var { data } = await http.get(apiEndpoint, config);

    /*var x = 20;
    while (x--) data.push({ ...data[0] });
    for (var i = 1; i < data.length; i++) {
        data[i].id = data[i - 1].id + 1;
    }*/

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
