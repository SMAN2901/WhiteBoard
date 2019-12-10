import http from "../services/httpService";
import { getEndpointUrl, getBaseUrl } from "./ApiUtility";
import { getAuthHeader, getCurrentUser } from "./AuthApi";
import { getUserData } from "./UsersApi";

function filterTags(tags) {
    // making the array unique
    tags.filter((item, i, ar) => {
        return ar.indexOf(item) === i;
    });

    // filtering tags according to length
    var a = [];
    var len = 0;
    var limit = 40;
    for (var i = 0; i < tags.length; i++) {
        if (len + tags[i].length > limit) break;
        a.push(tags[i]);
        len += tags[i].length;
    }
    return a;
}

function formatTags(tagstring) {
    const a = tagstring.split(" ").filter(item => item !== "");

    var tags = "";
    for (var i = 0; i < a.length; i++) {
        tags = tags + "#" + a[i];
    }

    return tags;
}

function jsonToFormdata(course, banner) {
    var form_data = new FormData();

    for (var key in course) {
        if (key === "banner") {
            if (!banner) banner = "";
            form_data.append("banner", banner);
        } else form_data.append(key, course[key]);
    }

    return form_data;
}

export async function createCourse(course, banner) {
    course.tags = formatTags(course.tags);
    course = jsonToFormdata(course, banner);

    try {
        const apiEndpoint = getEndpointUrl("createCourse");
        var config = getAuthHeader();

        var { data } = await http.post(apiEndpoint, course, config);

        return data;
    } catch (ex) {}
}

export async function getCourses() {
    try {
        const apiEndpoint = getEndpointUrl("courses");
        var config = getAuthHeader();
        var { data: courses } = await http.get(apiEndpoint, config);

        for (var i = 0; i < courses.length; i++) {
            courses[i].tags = filterTags(courses[i].tags);

            const author = await getUserData(courses[i].author);
            courses[i].author = {
                name: author
                    ? `${author.first_name} ${author.last_name}`
                    : null,
                username: author ? author.username : null
            };

            const approved_by = await getUserData(courses[i].approved_by);
            courses[i].approved_by = {
                name: approved_by
                    ? `${approved_by.first_name} ${approved_by.last_name}`
                    : null,
                username: approved_by ? approved_by.username : null
            };

            // temporary fix
            //var x = courses[i].banner.indexOf("/media");
            //courses[i].banner = getBaseUrl() + courses[i].banner.substring(x);
        }

        return courses;
    } catch (ex) {
        return [];
    }
}

export async function getCourse(id) {
    try {
        const apiEndpoint = getEndpointUrl("courses") + id + "/";
        var config = getAuthHeader();
        var { data: course } = await http.get(apiEndpoint, config);
        //course.tags = filterTags(course.tags);

        const author = await getUserData(course.author);
        course.author = {
            name: author ? `${author.first_name} ${author.last_name}` : null,
            username: author ? author.username : null
        };

        const approved_by = await getUserData(course.approved_by);
        course.approved_by = {
            name: approved_by
                ? `${approved_by.first_name} ${approved_by.last_name}`
                : null,
            username: approved_by ? approved_by.username : null
        };

        return course;
    } catch (ex) {
        return [];
    }
}

export async function getLatestCourse() {
    const user = getCurrentUser();
    if (!user) return null;

    try {
        const apiEndpoint = getBaseUrl() + `/${user.user_id}/course/`;
        var config = getAuthHeader();
        var { data: courses } = await http.get(apiEndpoint, config);
        var course = courses[0];

        course.tags = filterTags(course.tags);

        const author = await getUserData(course.author);
        course.author = {
            name: author ? `${author.first_name} ${author.last_name}` : null,
            username: author ? author.username : null
        };

        const approved_by = await getUserData(course.approved_by);
        course.approved_by = {
            name: approved_by
                ? `${approved_by.first_name} ${approved_by.last_name}`
                : null,
            username: approved_by ? approved_by.username : null
        };

        return course;
    } catch (ex) {
        return null;
    }
}
