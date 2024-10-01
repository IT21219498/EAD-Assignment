export const registerUser = async () =>{
    const registerModel = {
        // email: "testuser@example.com",
        // fullName: "Test User",
        // phoneNumber: "1234567890",
        // address: "123 Main St, City, Country",
        // password: "Test@12345",
        // role: "Vendor"  // CSR or Vendor

        fullName: "UserTwo3",
        email: "User@gmail.com",
        phoneNumber: "0998999098",
        address: "string",
        password: "S@stfe24242dfeering",
        role: "Vendor"
    };

    try{
        const response = await fetch('/api/Account/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerModel)
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Success:", result);
        } else {
            const error = await response.json();
            console.error("Error:", error);
        }
    } catch (error) {
        console.error("Request failed:", error);
    }
};