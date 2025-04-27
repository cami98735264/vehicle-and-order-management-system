interface AuthStore {
    isLoading: boolean;
    isAuthenticated: boolean;
    user: {
        id: number;
        rol: string;
        nombre: string;
        email: string;
    }
}
import { writable } from "svelte/store";
import axiosInstance from "../utils/axiosInstance.js";

const authStore = writable<AuthStore>({
    isLoading: true,
    isAuthenticated: false,
    user: {
        id: 0,
        rol: "",
        nombre: "",
        email: ""
    }
});


const check = async () => {
    try {
        const res = await axiosInstance.get("/auth/check");
        authStore.set({
            isLoading: false,
            isAuthenticated: true,
            user: res.data.user
        });

    } catch (error) {
        authStore.set({
            isLoading: false,
            isAuthenticated: false,
            user: {
                id: 0,
                rol: "",
                nombre: "",
                email: ""
            }
        })
    }
};


const logout = async () => {
    try {
        await axiosInstance.post("/auth/logout");
        authStore.set({
            isLoading: false,
            isAuthenticated: false,
            user: {
                id: 0,
                rol: "",
                nombre: "",
                email: ""
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const login = async (email: string, password: string) => {
    try {
        const res = await axiosInstance.post("/auth/login", {
            email,
            password
        });
        authStore.set({
            isLoading: false,
            isAuthenticated: true,
            user: res.data.user
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export {
    authStore,
    check,
    logout,
    login
};