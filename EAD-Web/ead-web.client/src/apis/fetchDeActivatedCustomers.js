
export const fetchDeActivatedCustomers = async () => {
    try {
      const response = await fetch("/api/Customer/deactivated");
      if (!response.ok) {
        throw new Error("Error fetching deactivated customers");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching deactivated customers:", error);
      throw error;
    }
  };
  