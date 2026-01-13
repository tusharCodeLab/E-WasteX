export default function DebugEnv() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Debug Env Vars</h1>
      <pre className="bg-zinc-100 p-4 rounded">
        {JSON.stringify({
          MONGODB_URI: process.env.MONGODB_URI ? "DEFINED" : "UNDEFINED",
          MONGO_URI: process.env.MONGO_URI ? "DEFINED" : "UNDEFINED",
          NODE_ENV: process.env.NODE_ENV,
        }, null, 2)}
      </pre>
    </div>
  );
}
