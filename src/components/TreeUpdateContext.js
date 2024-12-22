import React, { createContext, useContext, useState } from "react";

const TreeUpdateContext = createContext();

export const useTreeUpdate = () => useContext(TreeUpdateContext);

export const TreeUpdateProvider = ({ children }) => {
    const [updateTrigger, setUpdateTrigger] = useState(0);

    const triggerTreeUpdate = () => {
        setUpdateTrigger(prev => prev + 1);
    };

    return (
        <TreeUpdateContext.Provider value={{ updateTrigger, triggerTreeUpdate }}>
            {children}
        </TreeUpdateContext.Provider>
    );
};
