import { createContext, useState } from "react";

export const colorContext = createContext()

export const ColorProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false)

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
    }
    return (
        <colorContext.Provider value={{ isDarkMode, toggleDarkMode }} >
            {children}
        </colorContext.Provider >
    )
}