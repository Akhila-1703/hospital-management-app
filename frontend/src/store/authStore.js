import axios from "axios";
import { create } from "zustand";

export const useAuth = create((set) => ({
  currentUser: null,
  articles: [],
  loading: false,
  isAuthenticated: false,
  error: null,

  // CHECK AUTH AFTER REFRESH
  checkAuth: () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          isAuthenticated: true,
          currentUser: user,
        });
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    }
  },

  // LOGIN
  login: async (userCredWithRole) => {
    const { role: _role, ...userCredObj } = userCredWithRole;

    try {
      set({
        loading: true,
        error: null,
      });

      const res = await axios.post(
        "http://localhost:4000/common-api/login",
        userCredObj
      );

      console.log(res.data);

      // STORE TOKEN
      const token = res.data.token || res.data.payload?.token;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(res.data.payload));
      }

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
        error: null,
      });

    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Login failed",
        isAuthenticated: false,
        currentUser: null,
      });
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      await axios.get(
        "http://localhost:4000/common-api/logout",
        {
          withCredentials: true,
        }
      );

      // REMOVE TOKEN
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: null,
      });

    } catch (err) {

      // EVEN IF API FAILS, CLEAR LOCAL AUTH
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.message || "Logout failed",
      });
    }
  },
}));