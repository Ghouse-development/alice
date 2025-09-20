export const ImgFrame = ({ src, alt }: { src?: string; alt: string }) => (
  <div className="w-full aspect-[4/3] rounded-lg bg-gray-100 overflow-hidden">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <div className="flex items-center justify-center text-gray-400 h-full">{alt}</div>
    )}
  </div>
);