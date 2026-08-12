import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io(
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
);

const Chat = () => {
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const typingTimeOut = useRef(null);

    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log("Message received:", data);
            setMessages((prev) => [...prev, data.message]);
        });

        socket.on("user_typing", () => {
            setIsTyping(true);
        });

        socket.on("user_stop_typing", () => {
            setIsTyping(false);
        });

        return () => {
            socket.off("receive_message");
            socket.off("user_typing");
            socket.off("user_stop_typing");
            clearTimeout(typingTimeOut.current); 
        };
    }, []);

    const handleMessageInput = (e) => {
        const value = e.target.value;

        setMessage(value);

        if (!room) {
            return;
        }

        clearTimeout(typingTimeOut.current);  

        if (value.trim()) {
            socket.emit("typing", room);  

            typingTimeOut.current = setTimeout(() => {
                socket.emit("stop_typing", room);
            }, 500);  
        } else {
            socket.emit("stop_typing", room);
        }
    };

    const joinRoom = (e) => {
        e.preventDefault();

        if (!room.trim()) {
            return;
        }

        socket.emit("join_room", room);
        console.log(`Joined room: ${room}`);
    };

    const sendMessage = (e) => {
        e.preventDefault();

        if (!message.trim() || !room.trim()) {
            return;
        }

        clearTimeout(typingTimeOut.current);
        socket.emit("stop_typing", room);

        socket.emit("send_message", {
            message: message,
            room: room,
        });

        setMessages((prev) => [...prev, message]);
        setMessage("");
    };

    return (
        <div>
            <h2>Chat</h2>

            <hr />

            <form onSubmit={joinRoom}>
                <input
                    type="text"
                    value={room}
                    placeholder="Enter room..."
                    onChange={(e) => setRoom(e.target.value)}
                />
                <button type="submit">Join Room</button>
            </form>

            <hr />

            <div>
                <h3>Messages</h3>

                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}

            </div>

            {/* SEND MESSAGE */}
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    placeholder={isTyping ? "...typing" : "Type a message"}
                    onChange={handleMessageInput}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;