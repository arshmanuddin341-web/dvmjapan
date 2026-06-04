"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { getToken } from "@/lib/api-client";

const SOCKET_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    : "";

interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
  joinAuction: (auctionId: string) => void;
  leaveAuction: (auctionId: string) => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

/** Only connect when user is on an auction detail page to avoid WebSocket errors on rest of site. */
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const isAuctionPage =
    typeof pathname === "string" && pathname.startsWith("/auction/") && pathname !== "/auction";

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!SOCKET_URL || typeof window === "undefined" || !isAuctionPage) {
      const prev = socketRef.current;
      if (prev) {
        prev.removeAllListeners();
        prev.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    const token = getToken();
    const s = io(SOCKET_URL, {
      auth: token ? { token } : {},
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      timeout: 8000,
    });

    socketRef.current = s;
    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    s.on("connect_error", () => {
      setConnected(false);
    });

    setSocket(s);
    return () => {
      s.removeAllListeners();
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    };
  }, [isAuctionPage]);

  const joinAuction = useCallback(
    (auctionId: string) => {
      if (socket?.connected && auctionId) {
        socket.emit("auction:join-room", auctionId);
      }
    },
    [socket]
  );

  const leaveAuction = useCallback(
    (auctionId: string) => {
      if (socket?.connected && auctionId) {
        socket.emit("auction:leave", auctionId);
      }
    },
    [socket]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        joinAuction,
        leaveAuction,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): SocketContextValue | null {
  return useContext(SocketContext);
}
