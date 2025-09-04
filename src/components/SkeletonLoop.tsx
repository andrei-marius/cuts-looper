export default function SkeletonLoop() {
  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Saved Loops</h1>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Share URL</th>
            <th className="border px-4 py-2 text-left">Cuts</th>
            <th className="border px-4 py-2 text-left">Created At</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array(5).fill(0).map((_, i) => 
            <tr key={i}>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <td key={i} className="border px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-full max-w-[100px]" />
                  </td>
                ))
              }
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}