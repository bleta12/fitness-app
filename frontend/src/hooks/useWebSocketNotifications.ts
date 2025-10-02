import { useEffect } from "react";
import { io } from "socket.io-client";

const useWebSocketNotifications = (onMessage: (msg: string) => void) => {
    useEffect(() => {
        // lidhu me serverin e notifications
        const socket = io("http://localhost:5001", {
            transports: ["websocket"],
            reconnection: true,
        });

        socket.on("notification", (msg) => {
            console.log("📩 Notification received:", msg);
            onMessage(msg);
        });

        return () => {
            socket.off("notification");
            socket.disconnect();
        };
    }, []);
};

export default useWebSocketNotifications;
