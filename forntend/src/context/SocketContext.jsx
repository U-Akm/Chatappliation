import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuth();

    useEffect(() => {
        if (authUser) {
            const newSocket = io("http://localhost:4000", {
                query: { userId: authUser._id },
            });

            newSocket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            setSocket(newSocket);

            return () => newSocket.close();
        } else if (socket) {
            socket.close();
            setSocket(null);
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
