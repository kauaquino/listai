'use client'

import { Bot, Send, X } from "lucide-react"
import { useEffect, useState } from "react";
import { Message } from "@/app/message";

export function Chat({ reload }: { reload?: () => void }) {
    const [activeChat, setActiveChat] = useState(false);
    const [mensage, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!mensage.trim() || loading) return;

        const userMessage = {
            mensage: mensage,
            isIA: false,
            time: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMessage]);
        setMessage('');
        setLoading(true);

        const placeholderMessage = {
            mensage: "...",
            isIA: true,
            time: new Date().toLocaleTimeString()
        };
        const placeholderIndex = messages.length + 1;
        setMessages(prev => [...prev, placeholderMessage]);

        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: mensage })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro inesperado");
            }

            setMessages(prev => {
                const newMessages = [...prev.slice(0, -1)];
                return [...newMessages, {
                    mensage: data.response,
                    isIA: true,
                    time: new Date().toLocaleTimeString()
                }];
            });
            
            if(reload)
                reload();

        } catch (error: any) {
            setMessages(prev => {
                const newMessages = [...prev.slice(0, -1)];
                return [...newMessages, {
                    mensage: error.message || "Erro de conexão com o assistente.",
                    isIA: true,
                    time: new Date().toLocaleTimeString()
                }];
            });
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        setMessage('');
        setMessages([{
            mensage: "Olá, como posso ajudar?",
            isIA: true,
            time: new Date().toLocaleTimeString()
        }]);


    }, []);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            {!activeChat &&
                <div onClick={() => setActiveChat(true)} className="fixed cursor-pointer bg-primary p-2 rounded-full bottom-[10px] left-[10px]">
                    <Bot size={30} />
                </div>
            }

            {activeChat &&
                <div className="fixed bottom-10 left-10 bg-white w-[300px] h-[300px] rounded-sm">
                    <div className="flex pl-4 pr-4 justify-between items-center bg-primary w-full h-[50px] rounded-sm">
                        <Bot size={30} /> Ajudante <X className="cursor-pointer" onClick={() => setActiveChat(false)} />
                    </div>
                    <div className="h-[80%] overflow-y-auto pt-5  
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:bg-gray-100
                    [&::-webkit-scrollbar-thumb]:bg-gray-300
                    dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex pr-4 ${msg.isIA ? 'justify-start ml-4' : 'justify-end'}`}>
                                <div className={` ${!msg.isIA ? 'bg-gray-200 text-black' : 'bg-primary'} p-2 w-fit max-w-[200px] min-w-[200px] rounded-sm mb-4 `} >
                                    <div>{msg.mensage}</div>
                                    <div className="text-xs text-gray-500">{msg.time.split(':')[0] + ":" + msg.time.split(':')[1]}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex">
                        <input
                            value={mensage}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full bg-[#000] h-[50px] border-2 border-gray-300 rounded-sm p-2"
                            placeholder="Digite sua mensagem..."
                        />
                        <div
                            onClick={handleSendMessage}
                            className="cursor-pointer bg-primary w-[50px] h-[50px] flex items-center justify-center rounded-sm"
                        >
                            <Send />
                        </div>

                    </div>
                </div >
            }
        </>
    )
}