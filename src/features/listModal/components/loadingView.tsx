export default function LoadingView() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex items-center p-3 rounded-lg bg-white/5"
        >
          <div className="w-12 h-12 rounded-md mr-4 bg-white/10"></div>
          <div className="flex-1">
            <div className="h-4 w-3/4 bg-white/10 rounded mb-2"></div>
            <div className="h-3 w-1/2 bg-white/10 rounded"></div>
          </div>
          <div className="w-16 h-3 bg-white/10 rounded"></div>
        </div>
      ))}
    </div>
  );
}
