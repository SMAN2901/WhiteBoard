import config from "../config.json";

export function getBaseUrl() {
    return config.api.url;
}

export function getEndpointUrl(key) {
    const { api } = config;
    return api.url + api.endpoint[key];
}
