import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { supabase } from "../config/supabase";
import NoUser from "../assets/No-user.png";

const SettingsPage = () => {
  const { currentUser, userProfile, fetchUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || "",
    username: userProfile?.username || "",
    bio: userProfile?.bio || "",
    location: userProfile?.location || "",
    website: userProfile?.website || "",
    newAvatarFile: null,
    avatarPreviewUrl: null,
  });

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      newAvatarFile: file,
      avatarPreviewUrl: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const updateData = {
        displayName: formData.displayName,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
      };

      if (formData.newAvatarFile && currentUser) {
        const file = formData.newAvatarFile;
        const fileExt = file.name.split(".").pop();
        const filePath = `${currentUser.uid}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        updateData.avatarUrl = urlData.publicUrl;
      }

      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, updateData);
      await fetchUserProfile(currentUser.uid);

      setMessage("✅ Profile updated successfully.");

      // Clear message after 4 seconds
      setTimeout(() => setMessage(null), 4000);

      setFormData((prev) => ({
        ...prev,
        newAvatarFile: null,
        avatarPreviewUrl: null,
      }));
    } catch (error) {
      console.error("Error updating Firestore:", error);
      setMessage("❌ Something went wrong. Please try again later.");

      // Clear error message after 4 seconds
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Settings
      </h1>

      {message && (
        <div className="mb-4 text-sm text-center text-green-600 dark:text-green-400">
          {message}
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <img
          src={formData.avatarPreviewUrl || userProfile?.avatarUrl || NoUser}
          alt="avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 rounded-lg bg-twitter-blue text-white font-semibold hover:bg-twitter-blue-dark"
          >
            Upload Avatar
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleAvatarUpload}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {["displayName", "username", "location", "website"].map((name) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </label>
            <input
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-twitter-blue hover:bg-twitter-blue-dark text-white font-semibold rounded-lg disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
