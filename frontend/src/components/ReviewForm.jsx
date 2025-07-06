// src/components/ReviewForm.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";

const ReviewForm = () => {
  const { t } = useTranslation();

  const [reviewData, setReviewData] = useState({
    name: "",
    review: "",
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser?.displayName) {
        setReviewData((prev) => ({
          ...prev,
          name: firebaseUser.displayName,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setReviewData({ ...reviewData, [e.target.name]: e.target.value });
  };

  const handleRatingClick = (ratingValue) => {
    setReviewData({ ...reviewData, rating: ratingValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const reviewsRef = collection(db, "testimonials");
      const q = query(reviewsRef, where("name", "==", reviewData.name));
      const existing = await getDocs(q);
      if (!existing.empty) {
        alert(t("alreadySubmitted"));
        setSubmitting(false);
        return;
      }

      await addDoc(reviewsRef, {
        ...reviewData,
        createdAt: serverTimestamp(),
      });

      setReviewData({ name: user?.displayName || "", review: "", rating: 5 });
      alert(t("thankYouReview"));
    } catch (error) {
      console.error("Error adding review:", error);
      alert(t("submitError"));
    }

    setSubmitting(false);
  };

  return (
    <div className="bg-gray-800 text-white rounded shadow-md p-6">
      <h3 className="text-2xl font-bold text-yellow-400 mb-6">{t("leaveReview")}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">{t("yourName")}</label>
          <input
            type="text"
            name="name"
            value={reviewData.name}
            onChange={handleChange}
            placeholder={t("yourName")}
            className="w-full p-3 rounded bg-gray-700 text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">{t("yourReview")}</label>
          <textarea
            name="review"
            value={reviewData.review}
            onChange={handleChange}
            placeholder={t("yourReview")}
            className="w-full p-3 rounded bg-gray-700 text-white"
            rows="3"
            required
          ></textarea>
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold">{t("yourRating")}</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRatingClick(star)}
                className={`cursor-pointer text-2xl ${
                  star <= reviewData.rating ? "text-yellow-400" : "text-gray-500"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-500 py-2 rounded font-semibold disabled:opacity-50"
        >
          {submitting ? t("submitting") : t("submitReview")}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
