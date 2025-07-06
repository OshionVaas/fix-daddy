import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import AOS from "aos";
import "aos/dist/aos.css";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";

const HomePage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    description: "",
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `Repair Request:%0AService: ${formData.service}%0ADescription: ${formData.description}%0AName: ${formData.name}%0APhone: ${formData.phone}`;
    window.open(`https://wa.me/94770366169?text=${message}`, "_blank");
    setFormData({ name: "", phone: "", service: "", description: "" });
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* ✅ Banner Carousel */}
      <div data-aos="fade-up" data-aos-delay="300">
        <ProductCarousel className="animate-fade-in" />
      </div>

      {/* Hero Section */}
      <section className="text-center py-16 bg-blue-100" data-aos="fade-up">
        <h2 className="text-4xl font-bold mb-4">Don’t Toss It – FixDaddy It!</h2>
        <p className="text-lg mb-6">
          We repair your gadgets with care and speed. Book your repair now.
        </p>
        <Link to="/customerLookup">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Track Your Repair
          </button>
        </Link>
      </section>

      {/* ✅ Why Choose Fix Daddy */}
      <section className="py-16 bg-gray-900 text-white">
        <h2 className="text-4xl font-extrabold text-yellow-400 mb-8 text-center">Why Choose Fix Daddy</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {["🚀", "✅", "💎", "🧰", "😊", "🌱"].map((icon, i) => (
            <div
              key={i}
              className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-yellow-400/50 transition"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="text-5xl mb-4 text-center">{icon}</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2 text-center">
                {[
                  "Express Repairs",
                  "Warranty",
                  "Quality Parts",
                  "Qualified Experts",
                  "Over 100 Happy Customers",
                  "Eco Friendly",
                ][i]}
              </h3>
              <p className="text-center">
                {[
                  "Quick turnarounds for urgent needs.",
                  "Backed by our trustworthy service warranty.",
                  "We only use high-quality, reliable components.",
                  "Professionally trained technicians you can trust.",
                  "We’ve proudly served over 100 satisfied clients.",
                  "Committed to reducing e-waste and protecting the planet.",
                ][i]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ What We Repair (Updated with Modern Card Style) */}
      <section className="py-16 px-6 bg-gray-100" data-aos="fade-up">
        <h3 className="text-3xl font-bold text-center mb-10">What We Repair</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: "Fans.png", label: "Fans" },
            { icon: "Blenders.png", label: "Blenders" },
            { icon: "Rice cookers and toasters.png", label: "Rice Cooks & Toasters" },
            { icon: "Washing machine.png", label: "Wash Machines" },
            { icon: "Mixers.png", label: "Mixers" },
            { icon: "Overn.png", label: "Overs" },
            { icon: "Pumps.png", label: "Types of Pumps" },
            { icon: "Vacuum Cleaners.png", label: "Vacuum Cleaners" },
            { icon: "Motor winding.png", label: "Motor winding" },
            { icon: "Trimmers.png", label: "Trimmers" },
            { icon: "Grinders and Drill.png", label: "Grinders & Drill machines" },
          ].map((item, i) => (
            <div
              key={i}
              className="relative h-48 w-full overflow-hidden rounded-xl shadow hover:shadow-lg transition duration-300 group"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <img
                src={`/icons/${item.icon}`}
                alt={item.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center p-4">
                <h4 className="text-white text-lg font-semibold text-center">{item.label}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Book a Repair Section */}
      <section className="py-16 bg-gray-900 text-white text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-10">Book a Repair</h2>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg">
          {step === 1 && (
            <>
              <div className="mb-4 flex justify-center items-center">
                <label className="mr-4 font-semibold">Service Type</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="p-3 rounded bg-gray-700 text-white"
                  required
                >
                  <option value="">Select a service</option>
                  <option>Electrical Repair</option>
                  <option>Generator Installation</option>
                  <option>Wiring & Rewiring</option>
                  <option>Emergency Assistance</option>
                </select>
              </div>

              <div className="mb-4 flex justify-center items-center">
                <label className="mr-4 font-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about the issue"
                  rows="2"
                  className="p-3 rounded bg-gray-700 text-white w-80"
                  required
                />
              </div>

              <button type="button" onClick={handleNext} className="bg-green-500 px-6 py-2 rounded font-semibold">
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-4">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 rounded bg-gray-700 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="Your Phone Number"
                  className="w-full p-3 rounded bg-gray-700 text-white"
                  required
                />
              </div>
              <button type="submit" className="bg-green-500 px-6 py-2 rounded font-semibold">
                Submit Request
              </button>
            </>
          )}
        </form>
      </section>

      {/* ✅ Testimonials & Reviews */}
      <section className="py-16 px-4 bg-gray-100" data-aos="fade-up">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <ReviewList />
          <ReviewForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
