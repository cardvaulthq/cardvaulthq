import LiveFeed from "../components/LiveFeed";

export default function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Live Trading Dashboard</h1>
      <LiveFeed />
    </div>
  );
}
