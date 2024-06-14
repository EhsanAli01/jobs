import React, { createContext, useState } from 'react'

const ReRender = createContext();

const ContextProvider = ({ children }) => {
    const [render, setRender] = useState(1);

    return (
        <ReRender.Provider value={{ render, setRender }}>
            {children}
        </ReRender.Provider>
    )
}

export { ReRender, ContextProvider }