import { useState } from "react";
import { Modal, StyleSheet, Pressable, View } from "react-native";

interface DropdownProps {
    isVisible: boolean;
    position: { x: number, y: number };
    isDarkMode: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Dropdown = ({ isVisible, position, isDarkMode, onClose, children }: DropdownProps) => (
    <Modal
        visible={isVisible}
        transparent
        animationType="none"
        onRequestClose={onClose}
    >
        <Pressable style={styles.modalOverlay} onPress={onClose}>
            <View
                style={[
                    styles.dropdownContainer,
                    {
                        top: position.y - 25,
                        left: position.x - 130,
                        backgroundColor: isDarkMode ? '#414141' : '#ebeaea',
                    }
                ]}
            >
                {children}
            </View>
        </Pressable>
    </Modal>
);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
    },
    dropdownContainer: {
        position: 'absolute',
        width: 130,
        borderRadius: 2,
        paddingVertical: 10,
        elevation: 10,
        zIndex: 1,
    },
});