import React, { createContext, useState, useContext, useEffect } from 'react';

const MenuContext = createContext();


export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState(() => {
  
    const storedMenu = localStorage.getItem('menu');
    return storedMenu ? JSON.parse(storedMenu) : { breakfast: [], lunch: [], dinner: [] };
  });

 
  useEffect(() => {
    localStorage.setItem('menu', JSON.stringify(menu));
  }, [menu]);

  return (
    <MenuContext.Provider value={{ menu, setMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
