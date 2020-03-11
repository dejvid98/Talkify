import React, { useState, createContext } from "react";

export const AppContext = createContext();

export const ContextProvider = props => {
  const [newMessage, setNewMessage] = useState(2);

  return (
    <AppContext.Provider
      value={{
        newMessageContext: [newMessage, setNewMessage]
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
