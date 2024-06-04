import React, { createContext, useState } from 'react'

const ProgressContext = createContext();

export const ContextProvider = ({ children }) => {
    const [currentState, setCurrentState] = useState(1);

    return (
        <ProgressContext.Provider value={{ currentState, setCurrentState }}>
            {children}
        </ProgressContext.Provider>
    )
}

export default ProgressContext;
