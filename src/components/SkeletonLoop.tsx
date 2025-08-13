export default function SkeletonLoop() {
  return (
    <tr>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <td key={i} className="border px-4 py-2">
            <div className="h-4 bg-gray-300 rounded animate-pulse w-full max-w-[100px]" />
          </td>
        ))}
    </tr>
  );
}