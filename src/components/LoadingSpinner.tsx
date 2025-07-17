export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-lg flex items-center justify-center mb-4 mx-auto relative overflow-hidden">
          <svg viewBox="0 0 64 64" className="w-10 h-10 text-white">
            {/* Stylized road/path */}
            <path
              d="M8 56 L32 8 L56 56 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* PNG traditional geometric pattern */}
            <path
              d="M20 40 L32 28 L44 40 L32 52 Z"
              fill="currentColor"
              opacity="0.6"
            />
            {/* Tropical leaf elements */}
            <path
              d="M16 20 Q18 16 22 18 Q24 22 20 24 Q16 22 16 20"
              fill="currentColor"
              opacity="0.8"
            />
            <path
              d="M42 20 Q46 16 48 18 Q46 22 42 24 Q40 22 42 20"
              fill="currentColor"
              opacity="0.8"
            />
            {/* Central monitoring symbol */}
            <circle cx="32" cy="40" r="3" fill="white" />
          </svg>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">
          Loading PNG Road Construction Monitor...
        </p>
      </div>
    </div>
  );
}
