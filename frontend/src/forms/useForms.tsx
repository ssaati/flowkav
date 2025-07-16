import { useEffect, useState } from "react";
import { useDataProvider } from "react-admin";

const useForms = () => {
    const dataProvider = useDataProvider();
    const [forms, setForms] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        dataProvider.getList("forms", { pagination: { page: 1, perPage: 100 }, sort: { field: "name", order: "ASC" } })
            .then(({ data }) => setForms(data))
            .catch((error) => console.error(error));
    }, []);

    return forms;
};
const useForm = (id) => {
    const dataProvider = useDataProvider();
    const [form, setForm] = useState<{ id: number; name: string; json:{}}>();

    useEffect(() => {
        dataProvider.getOne("forms", {id:id})
            .then(({ data }) => setForm(data))
            .catch((error) => console.error(error));
    }, []);

    return form;
};
export {useForms, useForm};