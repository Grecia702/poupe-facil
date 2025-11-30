import { useState, useRef } from "react";
import { View } from "react-native";

export const useDropdown = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const buttonRef = useRef<View>(null)

    const open = () => {
        buttonRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
            setPosition({ x, y: y + height })
            setIsVisible(true)
        });
    }

    const close = () => setIsVisible(false)

    const toggle = () => {
        if (isVisible) {
            close();
        } else {
            open();
        }
    }

    return {
        isVisible,
        position,
        buttonRef,
        open,
        close,
        toggle
    }
}