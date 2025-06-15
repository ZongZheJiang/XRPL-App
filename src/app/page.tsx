// app/page.tsx
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">✅ XRPL Aid Backend is Running!</h1>
      <p className="mt-4">Use the API endpoints or visit <a href="/dev" className="text-blue-500 hover:underline">/dev</a> for the developer dashboard.</p>
    </main>
  );
}