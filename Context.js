import React, { useState, createContext } from "react";

export const AppContext = createContext();

export const ContextProvider = props => {
  const [newMessage, setNewMessage] = useState(2);
  const [target, setTarget] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [isLoggedIn,setIsLoggedIn] = useState(true);

  return (
    <AppContext.Provider
      value={{
        newMessageContext: [newMessage, setNewMessage],
        targetContext: [target, setTarget],
        isChattingContext: [isChatting, setIsChatting],
        isLoggedInContext: [isLoggedIn, setIsLoggedIn]
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
