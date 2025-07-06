// src/components/ReviewList.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoplaying, setAutoplaying] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "testimonials"),
      orderBy("createdAt", "desc"),
      limit(15)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto relative group">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        What our customers say
      </h2>

      {/* Pause/Play Toggle Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setAutoplaying(!autoplaying)}
          className="px-4 py-1 rounded bg-gray-800 text-white text-sm"
        >
          {autoplaying ? "Pause" : "Play"}
        </button>
      </div>

      {/* Loading / Empty State */}
      {loading ? (
        <p className="text-center text-gray-500 italic py-10">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-400 italic py-10">No reviews yet. Be the first to leave one!</p>
      ) : (
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={
            autoplaying ? { delay: 4000, disableOnInteraction: false } : false
          }
          pagination={{ clickable: true }}
          navigation={true}
          loop={true}
          spaceBetween={20}
          slidesPerView={1}
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="bg-white p-6 rounded-xl shadow text-gray-800 italic min-h-[150px] flex flex-col justify-between relative">
                <p className="text-lg mb-3">“{review.review}”</p>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xl ${
                          star <= (review.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="font-semibold not-italic text-gray-700">
                    - {review.name}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Custom Arrow Styling with Hover Behavior */}
      <style>{`
        .swiper-button-prev,
        .swiper-button-next {
          width: 30px;
          height: 30px;
          background-color: #f9fafb;
          color: #1f2937;
          border-radius: 9999px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.2s ease-in-out;
        }

        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background-color: #e5e7eb;
          color: #111827;
          transform: scale(1.05);
        }

        .group:hover .swiper-button-prev,
        .group:hover .swiper-button-next {
          opacity: 1 !important;
          visibility: visible !important;
        }

        .swiper-button-prev::after,
        .swiper-button-next::after {
          font-size: 14px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default ReviewList;
