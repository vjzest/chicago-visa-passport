import { Server } from "socket.io";
import { Server as HttpServer } from "http";

class SocketService {
    private static _io: Server | null = null;

    public static init(server: HttpServer) {
        if (this._io) return this._io;

        this._io = new Server(server, {
            cors: {
                origin: "*", // Adjust this to your frontend URL in production
                methods: ["GET", "POST"],
            },
        });

        this._io.on("connection", (socket) => {
            console.log("⚡ [Passport] A user connected:", socket.id);

            socket.on("disconnect", () => {
                console.log("🔥 [Passport] User disconnected:", socket.id);
            });
        });

        return this._io;
    }

    public static get io(): Server {
        if (!this._io) {
            throw new Error("Socket.io not initialized. Call init(server) first.");
        }
        return this._io;
    }

    public static emit(event: string, data: any) {
        if (this._io) {
            this._io.emit(event, data);
        }
    }
}

export default SocketService;
