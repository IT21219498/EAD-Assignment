export const fetchInventory = async () => {
  try {
    const response = await fetch("api/Inventory/getallstock", {
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
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const fetchLowStock = async () => {
  try {
    const response = await fetch("api/Inventory/getlowstock", {
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
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateStock = async (stock) => {
  try {
    const response = await fetch(`api/Inventory/updatestock`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stock),
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

export const deleteStock = async (id) => {
  try {
    const response = await fetch(`api/Inventory/deletestock/${id}`, {
      method: "DELETE",
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
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
