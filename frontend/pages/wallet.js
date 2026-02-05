import { useState, useEffect } from "react";

export default function WalletPage() {
  const userId = "CURRENT_USER_ID"; // replace with auth
  const [wallet, setWallet] = useState({});
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("local");
  const [accountInfo, setAccountInfo] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/users/wallet/${userId}`)
      .then(res => res.json())
      .then(data => setWallet(data));
  }, []);

  const handleWithdraw = async () => {
    const res = await fetch("/api/users/wallet/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, amount: parseFloat(amount), method, accountInfo }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage(`Withdrawal requested: ${amount} via ${method}`);
      setWallet(data.wallet);
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div className="p-4">
      <h1>Wallet</h1>
      <p>Main Balance: {wallet.mainBalance}</p>
      <p>Pending Balance: {wallet.pendingBalance}</p>

      <h2>Withdraw</h2>
      <input placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
      <select value={method} onChange={e => setMethod(e.target.value)}>
        <option value="local">Local Bank</option>
        <option value="foreign">Foreign Bank</option>
        <option value="USDT">USDT</option>
      </select>
      <input placeholder="Account / Wallet Info" value={accountInfo} onChange={e => setAccountInfo(e.target.value)} />
      <button onClick={handleWithdraw} className="bg-green-500 text-white p-2 mt-2">Withdraw</button>

      <p>{message}</p>
    </div>
  );
}
