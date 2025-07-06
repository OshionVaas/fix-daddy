// src/components/TestimonialsSlider.jsx
import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import AOS from "aos";
import "aos/dist/aos.css";

const TestimonialsSlider = () => {
  const [testimonials, setTestimonials] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const fetchTestimonials = async () => {
      const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"), limit(10));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setTestimonials(data);
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const scrollContainer = containerRef.current;
    let scrollInterval;

    if (scrollContainer) {
      scrollInterval = setInterval(() => {
        scrollContainer.scrollBy({ left: 1, behavior: "smooth" });
        if (
          scrollContainer.scrollLeft + scrollContainer.offsetWidth >=
          scrollContainer.scrollWidth
        ) {
          scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
        }
      }, 50); // lower = faster
    }

    return () => clearInterval(scrollInterval);
  }, [testimonials]);

  return (
    <div
      ref={containerRef}
      data-aos="fade-up"
      className="overflow-x-auto whitespace-nowrap py-4 scrollbar-hide"
    >
      {testimonials.map((t, i) => (
        <div
          key={i}
          className="inline-block w-80 mx-3 bg-white shadow-md rounded p-6 align-top text-left"
          data-aos="zoom-in"
          data-aos-delay={i * 100}
        >
          <p className="text-gray-700 italic mb-3">"{t.review}"</p>
          <p className="font-semibold text-right">- {t.name}</p>
        </div>
      ))}
    </div>
  );
};

export default TestimonialsSlider;
