export const registerUser = async (registerModel) =>{
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