import React, { useState, createContext } from "react";

export const AppContext = createContext();

export const ContextProvider = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newMessage, setNewMessage] = useState(1);

  return (
    <AppContext.Provider
      value={{
        isLoggedInContext: [isLoggedIn, setIsLoggedIn],
        newMessageContext: [newMessage, setNewMessage]
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
