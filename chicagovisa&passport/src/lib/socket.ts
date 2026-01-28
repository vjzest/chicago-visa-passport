import type { Socket } from "socket.io-client";
import { ENV } from "./env";

let socket: Socket | null = null;

export const getSocket = async () => {
    if (typeof window === "undefined") return null;

    if (!socket) {
        const { io } = await import("socket.io-client");
        socket = io(ENV.SERVER_URL, {
            autoConnect: true,
            reconnection: true,
        });
    }
    return socket;
};

let passportSocket: Socket | null = null;

export const getPassportSocket = async () => {
    if (typeof window === "undefined") return null;

    if (!passportSocket) {
        const { io } = await import("socket.io-client");
        // Use Passport Backend URL (4001)
        const passportUrl = process.env.NEXT_PUBLIC_PASSPORT_BASE_URL || "http://localhost:4001";
        // Remove /api/v1 if present for socket connection
        const serverUrl = passportUrl.replace('/api/v1', '');

        passportSocket = io(serverUrl, {
            autoConnect: true,
            reconnection: true,
        });
    }
    return passportSocket;
};
