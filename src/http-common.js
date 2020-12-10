import axios from "axios";
//http commons para google
export default axios.create({
    baseURL: "http://localhost:8090",
    headers: {
        "Content-type": "application/json"
    }
});