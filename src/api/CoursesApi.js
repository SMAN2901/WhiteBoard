import http from "../services/httpService";
import {
    getEndpointUrl,
    getBaseUrl,
    jsonToFormdata,
    formatTags
} from "./ApiUtility";
import { getAuthHeader, getCurrentUser } from "./AuthApi";

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
            courses[i].author = courses[i].author_info;
            courses[i].approved_by = courses[i].approved_by_info;
        }

        return courses;
    } catch (ex) {
        return [];
    }
}

export async function getBestsellerCourses() {
    try {
        const apiEndpoint = getEndpointUrl("courses") + "top-purchased/";
        var config = getAuthHeader();
        var { data: courses } = await http.get(apiEndpoint, config);

        for (var i = 0; i < courses.length; i++) {
            courses[i].author = courses[i].author_info;
            courses[i].approved_by = courses[i].approved_by_info;
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
            courses[i].author = courses[i].author_info;
            courses[i].approved_by = courses[i].approved_by_info;
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
            courses[i].author = courses[i].author_info;
            courses[i].approved_by = courses[i].approved_by_info;
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
            courses[i].author = courses[i].author_info;
            courses[i].approved_by = courses[i].approved_by_info;
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

        course.author = course.author_info;
        course.approved_by = course.approved_by_info;

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

        course.author = course.author_info;
        course.approved_by = course.approved_by_info;

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
            courses[i].author = courses[i].author_info;
            courses[i].approved_by = courses[i].approved_by_info;
        }

        return courses;
    } catch (ex) {
        return [];
    }
}

export async function getEnrolledCourses(username) {
    try {
        const apiEndpoint = getEndpointUrl("courses") + `enrolled/${username}/`;
        var config = getAuthHeader();
        var { data: courses } = await http.get(apiEndpoint, config);

        for (var i = 0; i < courses.length; i++) {
            courses[i].author = courses[i].author_info;
            courses[i].approved_by = courses[i].approved_by_info;
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
            courses[i].author = courses[i].author_info;
            courses[i].approved_by = courses[i].approved_by_info;
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

export async function contentCompleted(course_id, data) {
    const apiEndpoint = getEndpointUrl("courses") + `${course_id}/completed/`;
    const config = getAuthHeader();

    try {
        await http.post(apiEndpoint, data, config);
    } catch (ex) {}
}

export async function deleteContent(course_id, content_id) {
    const apiEndpoint =
        getEndpointUrl("courses") + `${course_id}/${content_id}/`;
    const config = getAuthHeader();

    try {
        const response = await http.get(apiEndpoint, config);
        return response;
    } catch (ex) {
        throw ex;
    }
}

export async function enroll(course_id, data) {
    const apiEndpoint = getEndpointUrl("courses") + `${course_id}/enroll/`;
    const config = getAuthHeader();

    try {
        const response = await http.post(apiEndpoint, data, config);
        return response.data;
    } catch (ex) {
        if (ex.response.status === 500) {
            return {
                data: "",
                errors: "Something went wrong. Please try again"
            };
        }
        return ex.response.data;
    }
}

export async function rateCourse(course_id, data) {
    const apiEndpoint = getEndpointUrl("courses") + `${course_id}/rating/`;
    const config = getAuthHeader();

    try {
        const response = await http.post(apiEndpoint, data, config);
        return response.data;
    } catch (ex) {
        throw ex;
    }
}

export async function reviewCourse(course_id, data) {
    const apiEndpoint = getEndpointUrl("courses") + `${course_id}/review/`;
    const config = getAuthHeader();

    try {
        const response = await http.post(apiEndpoint, data, config);
        return response.data;
    } catch (ex) {
        throw ex;
    }
}

export async function getCourseReview(course_id) {
    const apiEndpoint = getEndpointUrl("courses") + `${course_id}/review/`;
    const config = getAuthHeader();

    try {
        const response = await http.get(apiEndpoint, config);
        return response.data;
    } catch (ex) {
        return ex.response.data;
    }
}
