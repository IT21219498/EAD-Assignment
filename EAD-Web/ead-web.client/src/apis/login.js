export const loginUser = async (loginModel) => {
    try {
        const response = await fetch('/api/User/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginModel),
        });

        if (response.ok) {
            const result = await response.json();
            const { token, userId, role } = result;

            sessionStorage.setItem('token', token);
            sessionStorage.setItem('userId', userId);
            sessionStorage.setItem('role', role);

            return response; 
        } else {
            const error = await response.json();
            console.error("Login error:", error);
            return error; 
        }
    } catch (error) {
        console.error("Request failed:", error);
        throw error; // Propagate the error
    }
};
