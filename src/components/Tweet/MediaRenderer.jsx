import { useState } from "react";

const MediaRenderer = ({ mediaUrls }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const getType = (url) =>
    /\.(mp4|webm|ogg)$/i.test(url)
      ? "video"
      : /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
      ? "image"
      : null;

  const renderMediaItem = (url, index) => {
    const [error, setError] = useState(false);
    const type = getType(url);
    const isLastThree = mediaUrls.length === 3 && index === 2;
    const baseClass = `rounded-lg border object-cover w-full h-full ${
      isLastThree ? "col-span-2" : ""
    }`;

    if (error) {
      return (
        <div
          key={index}
          className={`flex items-center justify-center md:text-2xl text-sm text-red-500 bg-gray-100 dark:bg-dark-bg-secondary h-48 border rounded-md ${
            isLastThree ? "col-span-2" : ""
          }`}
        >
          {type === "video" ? "Video not available" : "Image not available"}
        </div>
      );
    }

    if (type === "video") {
      return (
        <video
          key={index}
          src={url}
          controls
          className={`max-h-96 ${baseClass}`}
          onError={() => setError(true)}
          onClick={() => setSelectedMedia(url)}
        />
      );
    }

    if (type === "image") {
      return (
        <img
          key={index}
          src={url}
          alt={`media-${index}`}
          className={baseClass}
          loading="lazy"
          onError={() => setError(true)}
          onClick={() => setSelectedMedia(url)}
        />
      );
    }

    return null;
  };

  const cols =
    mediaUrls.length === 1
      ? "grid-cols-1"
      : mediaUrls.length === 2
      ? "grid-cols-2"
      : mediaUrls.length === 3
      ? "grid-cols-2 grid-rows-2"
      : "grid-cols-2";

  return (
    <>
      <div className={`my-3 gap-2 grid ${cols}`}>
        {mediaUrls.map((url, i) => renderMediaItem(url, i))}
      </div>

      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={() => setSelectedMedia(null)}
        >
          {/\.(mp4|webm|ogg)$/i.test(selectedMedia) ? (
            <video
              src={selectedMedia}
              controls
              autoPlay
              className="max-h-[90vh] rounded-lg shadow-lg"
            />
          ) : (
            <img
              src={selectedMedia}
              alt="Full media"
              className="max-h-[90vh] rounded-lg shadow-lg"
            />
          )}
        </div>
      )}
    </>
  );
};

export default MediaRenderer;
