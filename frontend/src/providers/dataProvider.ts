import { fetchUtils } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

export const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL + '/api/v1';
// Custom HTTP client to add Authorization header
const httpClient = (url: string, options: RequestInit = {}) => {
    options.headers = new Headers(options.headers || { Accept: "application/json" });

    const token = localStorage.getItem("token");
    if (token) {
        (options.headers as Headers).set("Authorization", `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, options);
};

const dataProvider = simpleRestProvider(API_BASE_URL, httpClient);

export default {
    ...dataProvider, // Spread the existing CRUD methods
    results: async (formId) => {
        const { json } = await httpClient(`${API_BASE_URL}/results/list?formId=${formId}`);
        return json;
        // return fetch(`${API_URL}/results/list?formId=${formId}`, {
        //     method: 'GET',
        // }).then(response => response.json());
    },
    myForm: async (formId) => {
        const { json } = await httpClient(`${API_BASE_URL}/forms/my/${formId}`);
        return json;
        // return fetch(`${API_URL}/results/list?formId=${formId}`, {
        //     method: 'GET',
        // }).then(response => response.json());
    },
};
// export default dataProvider;
