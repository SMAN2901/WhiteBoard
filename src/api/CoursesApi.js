import http from "../services/httpService";
import { getEndpointUrl, getBaseUrl, jsonToFormdata } from "./ApiUtility";
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
    var limit = 30;
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

export function getTagString(a) {
    var str = "";
    a.forEach(tag => {
        str = str + tag + " ";
    });
    return str;
}

export async function createCourse(course, banner) {
    course.tags = formatTags(course.tags);
    course = jsonToFormdata(course, banner, "banner");

    try {
        const apiEndpoint = getEndpointUrl("createCourse");
        var config = getAuthHeader();

        var { data } = await http.post(apiEndpoint, course, config);

        return data;
    } catch (ex) {}
}

export async function updateCourse(id, course) {
    course.tags = formatTags(course.tags);

    try {
        const apiEndpoint = getEndpointUrl("courses") + `${id}/update/`;
        var config = getAuthHeader();

        var { data } = await http.put(apiEndpoint, course, config);

        return data;
    } catch (ex) {
        throw ex;
    }
}

export async function updateCourseBanner(id, banner = null) {
    try {
        const apiEndpoint = getEndpointUrl("courses") + `${id}/ban-update/`;
        var form_data = new FormData();
        form_data.append("banner", banner);
        var config = getAuthHeader();

        if (banner === null) form_data = { banner: null };

        var { data } = await http.put(apiEndpoint, form_data, config);

        return data;
    } catch (ex) {
        throw ex;
    }
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
                username: author ? author.username : null,
                profile_pic: author ? author.profile_pic : null
            };

            const approved_by = await getUserData(courses[i].approved_by);
            courses[i].approved_by = {
                name: approved_by
                    ? `${approved_by.first_name} ${approved_by.last_name}`
                    : null,
                username: approved_by ? approved_by.username : null,
                profile_pic: approved_by ? approved_by.profile_pic : null
            };
        }

        return courses;
    } catch (ex) {
        return [];
    }
}

export async function getTopRatedCourses() {
    try {
        const apiEndpoint = getEndpointUrl("courses") + "top_rated/";
        var config = getAuthHeader();
        var { data: courses } = await http.get(apiEndpoint, config);

        for (var i = 0; i < courses.length; i++) {
            courses[i].tags = filterTags(courses[i].tags);

            const author = await getUserData(courses[i].author);
            courses[i].author = {
                name: author
                    ? `${author.first_name} ${author.last_name}`
                    : null,
                username: author ? author.username : null,
                profile_pic: author ? author.profile_pic : null
            };

            const approved_by = await getUserData(courses[i].approved_by);
            courses[i].approved_by = {
                name: approved_by
                    ? `${approved_by.first_name} ${approved_by.last_name}`
                    : null,
                username: approved_by ? approved_by.username : null,
                profile_pic: approved_by ? approved_by.profile_pic : null
            };
        }

        return courses;
    } catch (ex) {
        return [];
    }
}

export async function getNewCourses() {
    try {
        const apiEndpoint = getEndpointUrl("courses") + "top_new/";
        var config = getAuthHeader();
        var { data: courses } = await http.get(apiEndpoint, config);

        for (var i = 0; i < courses.length; i++) {
            courses[i].tags = filterTags(courses[i].tags);

            const author = await getUserData(courses[i].author);
            courses[i].author = {
                name: author
                    ? `${author.first_name} ${author.last_name}`
                    : null,
                username: author ? author.username : null,
                profile_pic: author ? author.profile_pic : null
            };

            const approved_by = await getUserData(courses[i].approved_by);
            courses[i].approved_by = {
                name: approved_by
                    ? `${approved_by.first_name} ${approved_by.last_name}`
                    : null,
                username: approved_by ? approved_by.username : null,
                profile_pic: approved_by ? approved_by.profile_pic : null
            };
        }

        return courses;
    } catch (ex) {
        return [];
    }
}

export async function getFreeCourses() {
    try {
        const apiEndpoint = getEndpointUrl("courses") + "top_free/";
        var config = getAuthHeader();
        var { data: courses } = await http.get(apiEndpoint, config);

        for (var i = 0; i < courses.length; i++) {
            courses[i].tags = filterTags(courses[i].tags);

            const author = await getUserData(courses[i].author);
            courses[i].author = {
                name: author
                    ? `${author.first_name} ${author.last_name}`
                    : null,
                username: author ? author.username : null,
                profile_pic: author ? author.profile_pic : null
            };

            const approved_by = await getUserData(courses[i].approved_by);
            courses[i].approved_by = {
                name: approved_by
                    ? `${approved_by.first_name} ${approved_by.last_name}`
                    : null,
                username: approved_by ? approved_by.username : null,
                profile_pic: approved_by ? approved_by.profile_pic : null
            };
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
            username: author ? author.username : null,
            profile_pic: author ? author.profile_pic : null
        };

        const approved_by = await getUserData(course.approved_by);
        course.approved_by = {
            name: approved_by
                ? `${approved_by.first_name} ${approved_by.last_name}`
                : null,
            username: approved_by ? approved_by.username : null,
            profile_pic: approved_by ? approved_by.profile_pic : null
        };

        return course;
    } catch (ex) {
        throw ex;
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
            username: author ? author.username : null,
            profile_pic: author ? author.profile_pic : null
        };

        const approved_by = await getUserData(course.approved_by);
        course.approved_by = {
            name: approved_by
                ? `${approved_by.first_name} ${approved_by.last_name}`
                : null,
            username: approved_by ? approved_by.username : null,
            profile_pic: approved_by ? approved_by.profile_pic : null
        };

        return course;
    } catch (ex) {
        throw ex;
    }
}

export async function getCreatedCourses(user_id) {
    try {
        const apiEndpoint = getBaseUrl() + `/${user_id}/course/`;
        var config = getAuthHeader();
        var { data: courses } = await http.get(apiEndpoint, config);

        for (var i = 0; i < courses.length; i++) {
            courses[i].tags = filterTags(courses[i].tags);

            const author = await getUserData(courses[i].author);
            courses[i].author = {
                name: author
                    ? `${author.first_name} ${author.last_name}`
                    : null,
                username: author ? author.username : null,
                profile_pic: author ? author.profile_pic : null
            };

            const approved_by = await getUserData(courses[i].approved_by);
            courses[i].approved_by = {
                name: approved_by
                    ? `${approved_by.first_name} ${approved_by.last_name}`
                    : null,
                username: approved_by ? approved_by.username : null,
                profile_pic: approved_by ? approved_by.profile_pic : null
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

export async function searchCourses(searchString) {
    if (searchString === "" || searchString === null) {
        return [];
    }

    try {
        const apiEndpoint =
            getEndpointUrl("courses") + `search/?q=${searchString}`;
        var config = getAuthHeader();
        var { data: courses } = await http.get(apiEndpoint, config);

        for (var i = 0; i < courses.length; i++) {
            courses[i].tags = filterTags(courses[i].tags);

            const author = await getUserData(courses[i].author);
            courses[i].author = {
                name: author
                    ? `${author.first_name} ${author.last_name}`
                    : null,
                username: author ? author.username : null,
                profile_pic: author ? author.profile_pic : null
            };

            const approved_by = await getUserData(courses[i].approved_by);
            courses[i].approved_by = {
                name: approved_by
                    ? `${approved_by.first_name} ${approved_by.last_name}`
                    : null,
                username: approved_by ? approved_by.username : null,
                profile_pic: approved_by ? approved_by.profile_pic : null
            };
        }

        return courses;
    } catch (ex) {
        throw ex;
    }
}

export async function addContent(course_id, data, file, onUploadProgress) {
    const form_data = jsonToFormdata(data, file, "file");
    const apiEndpoint = getEndpointUrl("courses") + `${course_id}/add/`;
    var config = getAuthHeader();
    config.onUploadProgress = onUploadProgress;

    try {
        const response = await http.post(apiEndpoint, form_data, config);
        return response.data;
    } catch (ex) {
        throw ex;
    }
}

export async function getContents(course_id) {
    const apiEndpoint = getEndpointUrl("courses") + `${course_id}/contents/`;
    const config = getAuthHeader();

    try {
        const response = await http.get(apiEndpoint, config);
        return response.data;
    } catch (ex) {
        throw ex;
    }
}

export async function setPrerequisites(course_id, data) {
    const apiEndpoint = getEndpointUrl("courses") + `${course_id}/set-preq/`;
    const config = getAuthHeader();

    try {
        const response = await http.post(apiEndpoint, data, config);
        return response.data;
    } catch (ex) {
        return ex.response.data;
    }
}

export async function setPreview(course_id, preview) {
    const apiEndpoint =
        getEndpointUrl("courses") + `${course_id}/content-prev/`;
    const config = getAuthHeader();

    try {
        const response = await http.post(apiEndpoint, preview, config);
        return response.data;
    } catch (ex) {
        return ex.response.data;
    }
}
