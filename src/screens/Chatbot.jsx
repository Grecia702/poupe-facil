import React, { useState, useEffect, useRef, useContext } from 'react';
import api from '@context/axiosInstance';
import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colorContext } from '@context/colorScheme'

const Chatbot = () => {
    const [message, setMessage] = useState({ message_user: '' });
    const [messages, setMessages] = useState([]);
    const scrollViewRef = useRef(null);
    const { isDarkMode } = useContext(colorContext)
    const inputRef = useRef(null)
    const [isTyping, setIsTyping] = useState(false)
    useEffect(() => {
        const botReply = {
            content: `Olá! Sou seu assistente virtual e estou aqui pra te ajudar a cuidar das suas finanças.\n
Veja o que eu posso fazer por você:
            \n1- Criar novas transações - é só digitar algo como: "ifood 50 hoje" ou "Conta de luz 500 ontem"
            \n2- Mostrar seus gastos - por exemplo: "Quanto gastei na última semana?"
            \n3- Responder dúvidas gerais - tipo: "Como calculo juros simples?"`, role: 'assistant'
        };
        setMessages([botReply]);
    }, []);

    useEffect(() => {
        if (scrollViewRef.current && messages.length > 0) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }
    }, [messages, isTyping]);

    useFocusEffect(
        React.useCallback(() => {
            // Quando a tela ganhar foco, foca o input
            inputRef.current?.focus();
        }, [])
    );

    const sendMessage = async () => {
        if (message.message_user.trim() === '') return;
        const newMessage = { content: message.message_user, role: 'user' };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setMessage({ message_user: '' });
        setIsTyping(true)
        try {
            const { data } = await api.post('/gpt', {
                prompt: message.message_user,
                memory: JSON.stringify(messages.slice(-5))
            });
            const botReply = { content: `${data.message}`, role: 'assistant' };
            setMessages(prevMessages => [...prevMessages, botReply]);
        } catch (error) {
            console.log(error.message);
        } finally {
            setIsTyping(false);
        }
    }

    console.log(messages)

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
        >
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10, paddingBottom: 72 }}
                ref={scrollViewRef}
            >
                {messages.map((item, index) => (
                    <View key={index} style={[
                        styles.messageBase,
                        item.role === 'user' ? styles.messageUser : styles.messageBot,
                        { marginBottom: 24 }
                    ]}>
                        <Text style={styles.messageText}>{item.content}</Text>
                    </View>
                ))}
                {isTyping && (
                    <View style={[styles.messageBase, styles.messageBot, { marginBottom: 24, flexDirection: 'row', alignItems: 'center' }]}>
                        <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                    </View>
                )}
            </ScrollView>
            <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#222' : '#fffefe', borderColor: isDarkMode ? '#444' : '#ccc' }]}>
                <TextInput
                    style={[styles.input, { color: isDarkMode ? '#ccc' : '#333', borderColor: isDarkMode ? '#444' : '#ccc' }]}
                    placeholder="Digite sua mensagem..."
                    placeholderTextColor={isDarkMode ? '#aaa' : '#222'}
                    value={message.message_user}
                    // autoFocus={true}
                    ref={inputRef}
                    onSubmitEditing={sendMessage}
                    returnKeyType="send"
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
        maxWidth: '80%',
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
        textAlign: 'justify'
    },
});
