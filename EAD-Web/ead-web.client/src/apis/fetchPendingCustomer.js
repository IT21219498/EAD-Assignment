
export const fetchPendingCustomers = async () => {
    try {
      const response = await fetch("/api/Customer/pending-activation");
      if (!response.ok) {
        throw new Error("Error fetching pending approvals");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
      throw error;
    }
  };
  