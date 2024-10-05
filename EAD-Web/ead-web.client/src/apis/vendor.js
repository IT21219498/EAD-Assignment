export const fetchVendors = async () => {
    try {

        const response = await fetch("api/Vendor/allVendors", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Oops, we haven't got JSON!");
        }

        const data = await response.json();

        return data;

    }catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const saveVendor = async (vendor) => {

    try {
        const response = await fetch("api/Vendor/create", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(vendor),
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Oops, we haven't got JSON!");
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}