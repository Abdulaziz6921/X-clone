import { useState } from "react";

const MediaRenderer = ({ mediaUrls }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const getType = (url) =>
    /\.(mp4|webm|ogg)$/i.test(url)
      ? "video"
      : /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
      ? "image"
      : null;

  const handleMediaClick = (e, url, type) => {
    e.stopPropagation();
    e.preventDefault();
    // Pausing any video if clicked
    if (type === "video" && e.target.tagName === "VIDEO") {
      e.target.pause();
      e.target.currentTime = 0;
    }
    setSelectedMedia(url);
  };

  const renderMediaItem = (url, index) => {
    const [error, setError] = useState(false);
    const type = getType(url);

    if (error) {
      return (
        <div
          key={index}
          className="flex items-center justify-center text-red-500 bg-gray-100 dark:bg-dark-bg-secondary h-48 border rounded-md"
        >
          {type === "video" ? "Video not available" : "Image not available"}
        </div>
      );
    }

    const isThreeGrid = mediaUrls.length === 3 && index === 2;

    const commonClass = `
      w-full h-full object-cover rounded-xl border
      ${isThreeGrid ? "col-span-2" : ""}
      aspect-[4/5] max-h-[512px] overflow-hidden cursor-pointer
    `;

    return type === "video" ? (
      <video
        key={index}
        src={url}
        className={commonClass}
        controls
        muted
        playsInline
        onClick={(e) => handleMediaClick(e, url, type)}
        onError={() => setError(true)}
      />
    ) : (
      <img
        key={index}
        src={url}
        alt={`media-${index}`}
        className={commonClass}
        loading="lazy"
        onClick={(e) => handleMediaClick(e, url, type)}
        onError={() => setError(true)}
      />
    );
  };

  const gridCols =
    mediaUrls.length === 1
      ? "grid-cols-1"
      : mediaUrls.length === 2
      ? "grid-cols-2"
      : mediaUrls.length === 3
      ? "grid-cols-2 grid-rows-2"
      : "grid-cols-2";

  return (
    <>
      {/* Media Grid */}
      <div className={`my-3 grid gap-2 ${gridCols}`}>
        {mediaUrls.map((url, i) => renderMediaItem(url, i))}
      </div>

      {/* Full Media Viewer */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedMedia(null);
          }}
        >
          <div
            className="max-h-[90vh] max-w-[90vw] rounded-xl overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/\.(mp4|webm|ogg)$/i.test(selectedMedia) ? (
              <video
                src={selectedMedia}
                controls
                autoPlay
                className="max-h-[90vh] max-w-[90vw] rounded-xl"
              />
            ) : (
              <img
                src={selectedMedia}
                alt="Full view"
                className="max-h-[90vh] max-w-[90vw] rounded-xl"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MediaRenderer;
