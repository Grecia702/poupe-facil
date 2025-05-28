import React, { useState, useEffect, useRef, useContext } from 'react';
import api from '@context/axiosInstance';
import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, FlatList } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colorContext } from '@context/colorScheme';

const Chatbot = () => {
    const [message, setMessage] = useState({ message_user: '' });
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingDots, setTypingDots] = useState('');
    const flatListRef = useRef(null);
    const { isDarkMode } = useContext(colorContext);

    useEffect(() => {
        const botReply = { text: 'Olá, sou seu assistente virtual, como posso ajudar?', from: 'bot' };
        setMessages([botReply]);
    }, []);

    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    useEffect(() => {
        let interval;
        if (isTyping) {
            interval = setInterval(() => {
                setTypingDots(prev => (prev.length < 3 ? prev + '.' : ''));
            }, 500);
        } else {
            setTypingDots('');
        }
        return () => clearInterval(interval);
    }, [isTyping]);

    const sendMessage = async () => {
        if (message.message_user.trim() === '') return;
        const newMessage = { text: message.message_user, from: 'user' };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setMessage({ message_user: '' });
        setIsTyping(true);
        setMessages(prevMessages => [...prevMessages, { text: 'Digitando', from: 'bot', isTypingIndicator: true }]);

        try {
            const { data } = await api.post('/gpt', {
                prompt: message.message_user
            });
            setMessages(prevMessages => prevMessages.filter(msg => !msg.isTypingIndicator));
            const botReply = { text: data.message, from: 'bot' };
            setMessages(prevMessages => [...prevMessages, botReply]);
        } catch (error) {
            setMessages(prevMessages => prevMessages.filter(msg => !msg.isTypingIndicator));
            console.log(error.message);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
        >
            <FlatList
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageBase,
                        item.from === 'user' ? styles.messageUser : styles.messageBot,
                        item.isTypingIndicator && { fontStyle: 'italic', opacity: 0.7 }
                    ]}>
                        <Text style={styles.messageText}>
                            {item.isTypingIndicator ? `Digitando${typingDots}` : item.text}
                        </Text>
                    </View>
                )}
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10, paddingBottom: 72, gap: 24 }}
                ref={flatListRef}
            />

            <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#222' : '#fffefe', borderColor: isDarkMode ? '#444' : '#ccc' }]}>
                <TextInput
                    style={[styles.input, { color: isDarkMode ? '#ccc' : '#333', borderColor: isDarkMode ? '#444' : '#ccc' }]}
                    placeholder="Digite sua mensagem..."
                    placeholderTextColor={isDarkMode ? '#aaa' : '#222'}
                    value={message.message_user}
                    autoFocus={true}
                    onChangeText={(text) => setMessage({ message_user: text })}
                />
                <TouchableOpacity style={[styles.sendMessage, { borderColor: isDarkMode ? '#444' : '#ccc' }]} onPress={sendMessage}>
                    <MaterialIcons name="send" size={24} color={isDarkMode ? '#aaa' : '#222'} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Chatbot;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 32
    },
    inputContainer: {
        borderTopWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    input: {
        flex: 1,
        height: 50,
        borderColor: '#969696',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
    },
    sendMessage: {
        padding: 8,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#aaa',
    },
    messageBase: {
        maxWidth: '70%',
        minHeight: 48,
        padding: 12,
        borderRadius: 15,
    },
    messageUser: {
        alignSelf: 'flex-end',
        backgroundColor: '#38435c',
    },
    messageBot: {
        alignSelf: 'flex-start',
        backgroundColor: '#888888',
    },
    messageText: {
        fontSize: 16,
        color: '#fff',
    },
});
