export default function TestPage() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          🎉 PNG Road Monitor - Deployment Test
        </h1>
        <p className="text-green-600 text-lg mb-4">
          If you can see this page, the Vercel deployment is working!
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">System Status:</h2>
          <ul className="text-left space-y-2">
            <li className="text-green-600">✅ Next.js App Router working</li>
            <li className="text-green-600">✅ Vercel deployment successful</li>
            <li className="text-green-600">✅ TypeScript compilation passed</li>
            <li className="text-green-600">✅ Build process completed</li>
          </ul>
          <div className="mt-4">
            <a
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Main Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
