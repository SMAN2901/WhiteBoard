import http from "../services/httpService";
import config from "../config.json";

function unique_array(a) {
    return a.filter((item, i, ar) => {
        return ar.indexOf(item) === i;
    });
}

function filterTags(tags) {
    var a = [];
    var len = 0;
    var limit = 60;
    for (var i = 0; i < tags.length; i++) {
        if (len + tags[i].length > limit) break;
        a.push(tags[i]);
        len += tags[i].length;
    }
    return a;
}

export async function getCourses() {
    try {
        const apiEndpoint = config.apiUrl + "/courses.json";
        var { data: courses } = await http.get(apiEndpoint);

        for (var i = 0; i < courses.length; i++) {
            courses[i].tags = unique_array(courses[i].tags);
            courses[i].tags = filterTags(courses[i].tags);
        }
        return courses;
    } catch (ex) {
        return [];
    }
}
