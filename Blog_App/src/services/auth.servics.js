import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5254/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

const authService = {
  async login(email, password) {
    try {
      const response = await axiosInstance.post("/Login", { email, password });
      if (response.data.isSuccess) {
        const token = response.data.message;
        localStorage.setItem("token", token);
        localStorage.setItem("roles", JSON.stringify(response.data.roles));
        localStorage.setItem("name", JSON.stringify(response.data.name));
        localStorage.setItem("id", response.data.id);
      }
      return response.data; // Ensure this returns { isSuccess: true/false, message: "", roles: [] }
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Ensure errors are thrown to be caught in the component
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  getRoles() {
    const roles = localStorage.getItem("roles");
    return roles ? JSON.parse(roles) : [];
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  getName() {
    return localStorage.getItem("name");
  },
  getId() {
    const id = localStorage.getItem("id");
    console.log("Retrieved ID from localStorage:", id); // Debugging
    return id;
  },
  isAdmin() {
    const roles = this.getRoles();
    return roles.includes("Admin") || roles.includes("SuperAdmin");
  },

  async getUserRegistrations(startDate, endDate) {
    try {
      const response = await axiosInstance.get("/registrations", {
        params: { startDate, endDate },
      });
      return response.data; // Returns the user registration statistics data
    } catch (error) {
      console.error("Error fetching user registrations:", error);
      throw error;
    }
  },

  async AllUserDetails() {
    try {
      const response = await axiosInstance.get("/GetAllDetails");
      return response.data;
    } catch (error) {
      console.error("error fetching registered date details", error);
    }
  },
};

export default authService;
