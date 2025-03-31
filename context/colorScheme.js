import { createContext, useState } from "react";

export const colorContext = createContext()

export const ColorProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false)

    const changeState = () => {
        setIsDarkMode(!isDarkMode)
    }
    return (
        <colorContext.Provider value={{ isDarkMode, changeState }} >
            {children}
        </colorContext.Provider >
    )
}