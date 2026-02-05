import { useState } from "react";

// WebAuthn / browser-level biometric
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [useBiometric, setUseBiometric] = useState(false);

  const handlePasswordLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Password login successful");
    } else {
      alert(data.error);
    }
  };

  const handleBiometricLogin = async () => {
    if (!window.PublicKeyCredential) {
      alert("Biometric login not supported on this device/browser");
      return;
    }

    // Request challenge from server
    const challengeRes = await fetch(`/api/auth/biometric-challenge?email=${email}`);
    const challengeData = await challengeRes.json();

    try {
      const credential = await navigator.credentials.get({
        publicKey: challengeData,
      });

      // Send credential response to server
      const verifyRes = await fetch("/api/auth/biometric-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) alert("Biometric login successful");
      else alert(verifyData.error);

    } catch (err) {
      console.error(err);
      alert("Biometric authentication failed");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      {!useBiometric && (
        <>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <button onClick={handlePasswordLogin} className="bg-blue-500 text-white p-2 w-full mb-2">
            Login with Password
          </button>
        </>
      )}
      <button onClick={handleBiometricLogin} className="bg-green-500 text-white p-2 w-full">
        Login with Fingerprint / Face ID
      </button>
    </div>
  );
}
