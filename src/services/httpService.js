import axios from "axios";

//axios.defaults.headers.common["Content-Type"] = "application/json";
//axios.defaults.headers.common["Authorization"] = "JWT " + localStorage.getItem("token");

export default {
    get: axios.get,
    put: axios.put,
    post: axios.post,
    delete: axios.delete
};
