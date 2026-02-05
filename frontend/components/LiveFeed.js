import { useEffect, useState } from "react";
import io from "socket.io-client";

// Replace with your backend URL or localhost for testing
const socket = io("http://YOUR_BACKEND_URL:5000");

export default function LiveFeed() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    // Request the latest trades
    socket.emit("requestTrades");

    // Receive initial trades
    socket.on("initialTrades", (data) => {
      setTrades(data);
    });

    // Receive new trades in real-time
    socket.on("newTrade", (trade) => {
      setTrades(prev => [trade, ...prev].slice(0, 50)); // Keep latest 50 trades
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-64 overflow-y-auto border p-2 bg-black text-white">
      {trades.map((t, i) => (
        <div key={i} className="mb-1 p-1 bg-gray-800 rounded">
          <strong>{t.buyerId}</strong> bought <strong>{t.value} {t.currency}</strong> {t.type} card
        </div>
      ))}
    </div>
  );
                  }
