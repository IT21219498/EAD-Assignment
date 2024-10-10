export const approveDeActivatedCustomer = async (customerId) => {
    try {
      const response = await fetch(`/api/Customer/reactivate/${customerId}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Error in approving user");
      }
      return response;
    } catch (error) {
      console.error("Request failed", error);
      throw error;
    }
  };
  