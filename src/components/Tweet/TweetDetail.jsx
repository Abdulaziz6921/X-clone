// pages/TweetDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Tweet from "./Tweet";
import { listenToReplies } from "../../services/tweetService";

const TweetDetail = () => {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState(null);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const fetchTweet = async () => {
      const docRef = doc(db, "tweets", tweetId);
      const tweetSnap = await getDoc(docRef);
      if (tweetSnap.exists()) {
        setTweet({ id: tweetSnap.id, ...tweetSnap.data() });
      }
    };

    fetchTweet();

    const unsubscribe = listenToReplies(tweetId, (data) => setReplies(data));
    return () => unsubscribe();
  }, [tweetId]);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-4 ">
      {tweet && <Tweet tweet={tweet} isTweetDetail={true} />}
      <div className="border-t pt-4 space-y-3">
        {replies.map((reply) => (
          <Tweet key={reply.id} tweet={reply} isReply={true} />
        ))}
      </div>
    </div>
  );
};

export default TweetDetail;
