import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [trades, setTrades] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/admin/trades").then(r => r.json()).then(setTrades);
    fetch("/api/admin/users").then(r => r.json()).then(setUsers);
  }, []);

  const restoreCard = async (cardId, userId) => {
    await fetch("/api/admin/restore-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId, userId }),
    });
    alert("Card restored!");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <h2 className="text-xl mt-4">Trades</h2>
      <ul>
        {trades.map(t => (
          <li key={t.id}>
            {t.buyerId} bought {t.value} {t.currency} {t.type} card
          </li>
        ))}
      </ul>

      <h2 className="text-xl mt-4">Users (IP/Device Tracking)</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.username} — IP: {u.lastIP || "N/A"}, Device: {u.lastDevice || "N/A"}
          </li>
        ))}
      </ul>

      {/* Example restore button */}
      <button
        className="bg-green-500 text-white p-2 mt-4"
        onClick={() => restoreCard("CARD_ID_HERE", "USER_ID_HERE")}
      >
        Restore Card
      </button>
    </div>
  );
}
