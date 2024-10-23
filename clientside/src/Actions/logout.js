const logout = async (token, clearAuth) => {
    const url = `http://localhost:9090/api/logout?sessionId=${token}`;
  
    try {
      const response = await fetch(url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Sign out successful:', data);
  
     
      clearAuth();
      
    
    } catch (error) {
      console.error('Sign out failed:', error);
    }
};
  
export default logout;
