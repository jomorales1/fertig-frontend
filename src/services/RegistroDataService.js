import http from "../http-common";

class RegistroDataService {
    /*get(id) {
        return http.get(`/tutorials/${id}`);
    }*/

    addUsuario(data) {
        return http.post("/add", data);
    }
}

export default new RegistroDataService();