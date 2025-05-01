import React, { createContext, useContext } from 'react';
import Toast from 'react-native-toast-message'

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const showToast = (type, text1, text2 = null) => {
        Toast.show({
            type,
            text1,
            text2,
            position: 'top',
            visibilityTime: 3000,
        });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast />
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
