'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              システムエラー
            </h2>
            <p className="text-gray-600 mb-4">
              重大なエラーが発生しました。ページを再読み込みしてください。
            </p>
            <button
              onClick={reset}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              再読み込み
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}