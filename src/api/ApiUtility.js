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
