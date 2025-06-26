import { useState, useRef, useEffect } from "react";
import { Image, MapPin, Smile, Calendar, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { createTweet, addReply } from "../../services/tweetService";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";
import { supabase } from "../../config/supabase";

const TweetComposer = ({
  onTweetCreated,
  replyingToTweet = null,
  isReplyModal = false,
}) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef();
  const { currentUser, userProfile } = useAuth();
  const remainingChars = 280 - content.length;

  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationFetched, setLocationFetched] = useState(false);

  const [showDate, setShowDate] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(null);

  const textareaRef = useRef(null);

  const handleInput = (e) => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = textarea.scrollHeight + "px"; // Adjust to content
  };

  const handleEmojiSelect = (emoji) => {
    setContent((prev) => prev + emoji.native);
  };

  const handleFilesSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    const filePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));
    setPreviews((prev) => [...prev, ...filePreviews]);
  };

  const removeFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);

    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);
  };

  const uploadToSupabase = async (file) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `tweets/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("tweets")
      .upload(filePath, file);
    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("tweets")
      .getPublicUrl(filePath);
    return urlData.publicUrl;
  };
  // Location
  const handleGetLocation = () => {
    // Toggle OFF: If location is already set, clear it
    if (location) {
      setLocation("");
      setLocationFetched(false);
      return;
    }

    // Toggle ON: Fetch location
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    setLocationFetched(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: {
                "User-Agent": "twitter-clone-app",
              },
            }
          );

          const data = await response.json();
          const address = data.address || {};
          const city =
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            address.state ||
            "";
          const country = address.country || "";

          const formattedLocation =
            city || country
              ? `${city}${city && country ? ", " : ""}${country}`
              : `Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`;

          setLocation(formattedLocation);
          setLocationFetched(true);
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          alert("Failed to get location name.");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location.");
        setLocationLoading(false);
      }
    );
  };

  // Date and Time
  const handleSetDate = () => {
    if (showDate) {
      setScheduledAt(null); // remove scheduled time
      setShowDate(false); // hide the display
    } else {
      const now = new Date();
      setScheduledAt(now); // store current time
      setShowDate(true); // show the date
    }
  };

  const formattedDate = scheduledAt
    ? `${scheduledAt.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })} ${scheduledAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`
    : "";

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    try {
      let mediaUrls = [];
      for (const file of selectedFiles) {
        const url = await uploadToSupabase(file);
        mediaUrls.push(url);
      }

      const tweetData = {
        content: content.trim(),
        userId: currentUser.uid,
        username: userProfile.username,
        displayName: userProfile.displayName,
        verified: userProfile.verified || false,
        mediaUrls,
        createdAt: new Date(),
        location,
        scheduledAt,
      };

      if (userProfile.avatarUrl) {
        tweetData.avatarUrl = userProfile.avatarUrl;
      }

      if (isReplyModal && replyingToTweet) {
        await addReply(replyingToTweet.id, tweetData); // <-- send as reply
      } else {
        await createTweet(tweetData); // <-- normal tweet
      }

      setContent("");
      setSelectedFiles([]);
      setPreviews([]);
      if (onTweetCreated) onTweetCreated();
    } catch (error) {
      console.error("Error creating tweet:", error);
    } finally {
      setIsLoading(false);
      setLocationFetched(false);
      setLocation("");
      setShowDate(false);
      setScheduledAt(null);
    }
  };

  return (
    <div
      className={`${
        isReplyModal
          ? "pt-4 relative w-full pb-14"
          : "border-b border-gray-200 dark:border-dark-border p-3 md:p-4 "
      }`}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3 ">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-twitter-blue rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ">
            {userProfile?.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold">
                {userProfile?.displayName?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </div>

          <div className="flex-1 ">
            <textarea
              ref={textareaRef}
              onInput={handleInput}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                replyingToTweet ? "Post your reply" : "What's happening?"
              }
              className="w-full md:text-xl text-md placeholder-gray-500 dark:placeholder-dark-text-secondary bg-transparent text-gray-900 dark:text-dark-text border-none outline-none resize-none overflow-hidden"
              rows={replyingToTweet ? 4 : 1}
              maxLength={280}
            />

            {previews.length > 0 && (
              <div className="flex gap-3 flex-wrap mt-3">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    {preview.type === "image" ? (
                      <img
                        src={preview.url}
                        alt={`preview-${index}`}
                        className="max-h-40 rounded-md"
                      />
                    ) : (
                      <video
                        src={preview.url}
                        controls
                        className="max-h-40 rounded-md"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Date and location preview */}
            <div className="flex flex-col md:flex-row gap-4  items-left mt-4">
              {showDate && (
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary ">
                  📅 {formattedDate}
                </p>
              )}

              {location && (
                <div className="inline-flex items-center text-sm text-gray-800 dark:text-dark-text  rounded-full">
                  <MapPin className="h-4 w-4 mr-1 text-twitter-blue" />
                  {location}
                </div>
              )}
            </div>

            <div
              className={`flex items-center justify-between mt-4 ${
                isReplyModal && "absolute left-0 bottom-1 w-fit h-fit"
              } `}
            >
              <div className="flex space-x-4 items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  title="Add media"
                  className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-secondary transition-colors ${
                    selectedFiles.length > 0
                      ? "text-green-600"
                      : "text-twitter-blue"
                  }`}
                >
                  <Image className="h-5 w-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleFilesSelect}
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  title="Add location"
                  className="relative p-2 rounded-full hover:bg-green-100 dark:hover:bg-dark-bg-secondary transition-colors text-twitter-blue"
                >
                  {locationLoading ? (
                    <div className="h-5 w-5 animate-spin border-2 border-blue-500 border-t-transparent rounded-full" />
                  ) : (
                    <MapPin
                      className={`h-5 w-5  ${
                        locationFetched
                          ? " text-green-600"
                          : "text-twitter-blue"
                      }`}
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Add emoji"
                  className={`relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg-secondary transition-colors ${
                    /[\u{1F300}-\u{1FAFF}]/u.test(content)
                      ? "text-green-600"
                      : "text-twitter-blue"
                  }`}
                >
                  <Smile className="h-5 w-5" />{" "}
                  {showEmojiPicker && (
                    <>
                      {/* Backdrop Shield */}
                      <div
                        onClick={() => setShowEmojiPicker(false)}
                        className="fixed inset-0 z-40 bg-transparent cursor-default"
                      />

                      {/* Emoji Picker (on top of shield) */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        ref={emojiPickerRef}
                        className="absolute z-50 w-full max-w-xs sm:max-w-sm bg-white dark:bg-dark-bg right-[150px] -bottom-52 md:-bottom-72 rounded-xl shadow-lg border border-gray-200 dark:border-dark-border"
                      >
                        <Picker
                          data={emojiData}
                          onEmojiSelect={handleEmojiSelect}
                        />
                      </div>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSetDate}
                  className={`hover:bg-gray-100 dark:hover:bg-dark-bg-secondary p-2 rounded-full transition-colors  ${
                    showDate ? "text-green-600" : "text-twitter-blue"
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <span
                  className={`text-sm ${
                    remainingChars < 20
                      ? "text-red-500"
                      : "text-gray-500 dark:text-dark-text-secondary"
                  }`}
                >
                  {remainingChars}
                </span>
                <button
                  type="submit"
                  disabled={!content.trim() || isLoading || remainingChars < 0}
                  className="bg-twitter-blue text-white px-6 py-2 rounded-full font-semibold hover:bg-twitter-blue-dark transition-colors disabled:opacity-50"
                >
                  {isLoading
                    ? isReplyModal
                      ? "Replying..."
                      : "Tweeting..."
                    : isReplyModal
                    ? "Reply"
                    : "Tweet"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TweetComposer;
