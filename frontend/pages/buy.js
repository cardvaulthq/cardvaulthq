import { useState } from "react";

export default function BuyPage() {
  const [cardId, setCardId] = useState("");
  const [payment, setPayment] = useState("");
  const [message, setMessage] = useState("");

  const handleBuy = async () => {
    const res = await fetch("/api/cards/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardId,
        buyerId: "CURRENT_USER_ID",
        paymentAmount: parseFloat(payment),
        paymentMethod: "wallet", // placeholder
      }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage(`Card unlocked! Scratch code: ${data.card.scratchCode}`);
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div className="p-4">
      <h1>Buy Gift Card</h1>
      <input placeholder="Card ID" value={cardId} onChange={e => setCardId(e.target.value)} />
      <input placeholder="Payment Amount" type="number" value={payment} onChange={e => setPayment(e.target.value)} />
      <button onClick={handleBuy} className="bg-blue-500 text-white p-2 mt-2">Buy Now</button>
      <p>{message}</p>
    </div>
  );
    }
