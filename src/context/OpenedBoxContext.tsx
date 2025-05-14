"use client"
import React, { createContext, useContext, useState } from "react";

type OpenedBoxContextType = {
    openedBoxId: string | null;
    setOpenedBoxId: (id: string | null) => void;
};

const OpenedBoxContext = createContext<OpenedBoxContextType>({
    openedBoxId: null,
    setOpenedBoxId: () => {},
});

export const OpenedBoxProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [openedBoxId, setOpenedBoxId] = useState<string | null>(null);

    return (
        <OpenedBoxContext.Provider value={{ openedBoxId, setOpenedBoxId }}>
            {children}
        </OpenedBoxContext.Provider>
    );
};

export const useOpenedBox = () => useContext(OpenedBoxContext);
