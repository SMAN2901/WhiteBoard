import config from "../config.json";

export function getBaseUrl() {
    return config.api.url;
}

export function getEndpointUrl(key) {
    const { api } = config;
    return api.url + api.endpoint[key];
}

export function jsonToFormdata(data, file, fileKey) {
    var form_data = new FormData();

    for (var key in data) {
        if (key === fileKey) {
            if (!file) file = "";
            form_data.append(fileKey, file);
        } else form_data.append(key, data[key]);
    }

    return form_data;
}

export function filterTags(tags) {
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

export function formatTags(tagstring) {
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
