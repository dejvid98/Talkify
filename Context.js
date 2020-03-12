import React, { useState, createContext } from "react";

export const AppContext = createContext();

export const ContextProvider = props => {
  const [newMessage, setNewMessage] = useState(2);
  const [target, setTarget] = useState("");
  const [isChatting, setIsChatting] = useState(false);

  return (
    <AppContext.Provider
      value={{
        newMessageContext: [newMessage, setNewMessage],
        targetContext: [target, setTarget],
        isChattingContext: [isChatting, setIsChatting]
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
