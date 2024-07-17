import axios from "axios";

const API_URL = "http://localhost:5103/api/auth/";

class AuthService {
  login(user) {
    return axios
      .post(API_URL + "login", {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.data.jwtToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      })
      .catch((error) => {
        console.error("Login Error:", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Response Data:", error.response.data);
          console.error("Response Status:", error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Request:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error Message:", error.message);
        }
        throw error; // Rethrow the error to handle it in the Vue component
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(user) {
    return axios
      .post(API_URL + "register", {
        name: user.name,
        email: user.email,
        password: user.password,
      })
      .catch((error) => {
        console.error("Registration Error:", error);
        throw error; // Rethrow the error to handle it in the Vue component
      });
  }
}

export default new AuthService();
