import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activeCharacter, setActiveCharacter] = useState('TJ');
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);

  return (
    <AppContext.Provider
      value={{
        activeCharacter,
        setActiveCharacter,
        tasks,
        setTasks,
        messages,
        setMessages
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
