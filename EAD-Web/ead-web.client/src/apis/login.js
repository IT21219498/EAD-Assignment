export const loginUser =  async(loginModel) => {
    try{
        const response = await fetch('/api/User/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },  
            body:JSON.stringify(loginModel)
            
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Login successful:", result);
            // You might want to store the JWT token here, e.g. localStorage.setItem('token', result.token);
        } else {
            const error = await response.json();
            console.error("Login error:", error);
        }
    }catch(error){
        console.error("Request Failed:",error);
    }
}