import { useEffect, useState } from "react";
import { useDataProvider } from "react-admin";

const useRoles = () => {
    const dataProvider = useDataProvider();
    const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        dataProvider.getList("users", { pagination: { page: 1, perPage: 100 }, sort: { field: "name", order: "ASC" } })
            .then(({ data }) => setRoles(data))
            .catch((error) => console.error(error));
    }, []);

    return roles;
};
export default useRoles;