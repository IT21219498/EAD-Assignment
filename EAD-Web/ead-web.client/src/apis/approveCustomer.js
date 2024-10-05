export const approveCustomer = async (customerId) => {
    try {
      const response = await fetch(`/api/Customer/activate/${customerId}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Error in approving Customer");
      }
      return response;
    } catch (error) {
      console.error("Request failed", error);
      throw error;
    }
  };
  