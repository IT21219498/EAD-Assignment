export const fetchOrders = async () => {
  try {
    const response = await fetch("api/Orders/dummy", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
};
