import { useEffect, useRef } from "react";

const useWebSocketNotifications = (showToast: (msg: string) => void) => {
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/ws");
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("✅ Connected to WebSocket");
        };

        socket.onmessage = (event) => {
            console.log("📩 Message:", event.data);
            showToast(event.data); // 👉 shfaq toast në frontend
        };

        socket.onerror = (err) => {
            console.error("❌ WebSocket error:", err);
        };

        socket.onclose = () => {
            console.log("⚠️ WebSocket closed");
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = (msg: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(msg);
        } else {
            console.warn("⚠️ WebSocket not connected");
        }
    };

    return { sendMessage };
};

export default useWebSocketNotifications;
