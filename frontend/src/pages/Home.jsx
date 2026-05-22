import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  Heart,
  Brain,
  Eye,
  Smile,
  Activity,
  Sparkles,
  Stethoscope,
  Scissors,
  Users,
  Award,
  Clock,
  ShieldAlert,
  MapPin,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Star,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  Baby
} from "lucide-react";

import {
  pageBackground,
  headingClass,
  subHeadingClass,
  bodyText,
} from "../styles/Common.js";

import {
  cardiology,
  orthopedics,
  neurology,
  pediatrics,
  Gynecology,
  Ophthalmology,
  Dentistry,
  Pulmonology,
  Dermatology,
  Oncology,
  Physiotherapy,
  ENT,
  hero,
} from "../assets";

function Home() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [searchDocId, setSearchDocId] = useState("");
  const [searchSpecialty, setSearchSpecialty] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchDoctorName, setSearchDoctorName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Testimonials Carousel State
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Fetch doctors list for our interactive Quick-Booking search widget
  useEffect(() => {
    axios
      .get("/common-api/doctors")
      .then((res) => {
        const docList = res.data.payload || [];
        setDoctors(docList);
        
        // Extract unique specialties
        const uniqueSpecs = [...new Set(docList.map((doc) => doc.specialization))].filter(Boolean);
        setSpecialties(uniqueSpecs);
      })
      .catch((err) => console.error("Error fetching doctors for widget:", err));
  }, []);

  // Filtered doctors list based on search criteria (doctor name, specialty, location)
  const searchResults = doctors.filter((doc) => {
    const doctorName = doc.userId?.name || "";
    const matchesName = doctorName.toLowerCase().includes(searchDoctorName.toLowerCase());
    const matchesSpecialty = !searchSpecialty || doc.specialization === searchSpecialty;
    return matchesName && matchesSpecialty;
  });

  // Handle Find & Book from Homepage widget
  const handleQuickBook = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Redirect to patient-dashboard and pre-select the doctor if they picked one
    if (searchDocId) {
      navigate("/patient-dashboard", {
        state: { 
          doctorId: searchDocId,
          appointmentDate: searchDate 
        },
      });
    } else {
      navigate("/doctors", { state: { specialization: searchSpecialty } });
    }
  };

  // Generic Book Appointment Navigation
  const handleBookAppointment = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/doctors");
    }
  };

  // Testimonials list
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Cardiology Patient",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120",
      content: "The cardiology department at PeopleCare gave me a second chance at life. The medical professionals were incredibly supportive, and the technology they utilized was state-of-the-art. I highly recommend them.",
      rating: 5,
    },
    {
      name: "David Miller",
      role: "Orthopedics Patient",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
      content: "My knee replacement surgery was completely seamless. I was back on my feet much quicker than anticipated, thanks to the excellent physiotherapy and custom post-op rehabilitation programs.",
      rating: 5,
    },
    {
      name: "Dr. Elena Rostova",
      role: "Pediatrics Mother",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120",
      content: "As a health expert myself, I am very selective about pediatric care. PeopleCare's pediatric team demonstrated world-class empathy, patience, and impeccable clinical expertise with my newborn.",
      rating: 5,
    },
  ];

  // FAQ list
  const faqs = [
    {
      question: "How can I book an appointment with a specialist doctor?",
      answer: "You can book an appointment easily by creating an account as a Patient, completing your basic profile details, navigating to 'Doctors', choosing your specialist, and choosing a suitable date & time.",
    },
    {
      question: "Do you offer emergency medical services 24/7?",
      answer: "Yes, PeopleCare International Hospital provides fully functional 24/7 emergency services, a rapid-response ambulance network, critical care units (ICUs), and diagnostic laboratories ready at all hours.",
    },
    {
      question: "Can I download my prescriptions and medical reports online?",
      answer: "Absolutely. Once a doctor issues a prescription or uploads a record from their dashboard, it will be visible in your Patient Dashboard under 'Your Appointments' and 'Records', where you can download them as a PDF.",
    },
    {
      question: "Are your medical staff and doctors ISO/NABH certified?",
      answer: "Yes, all our physicians and surgeons are board-certified specialists with international credentials. Our hospital facilities are proudly ISO 9001:2015 and NABH (National Accreditation Board for Hospitals) certified.",
    },
  ];

  // Icon mapper for specializations
  const getSpecialtyIcon = (name) => {
    switch (name.toLowerCase()) {
      case "cardiology":
        return <Heart className="w-8 h-8 text-rose-500" />;
      case "orthopedics":
        return <Activity className="w-8 h-8 text-emerald-500" />;
      case "neurology":
        return <Brain className="w-8 h-8 text-indigo-500" />;
      case "pediatrics":
        return <Users className="w-8 h-8 text-amber-500" />;
      case "gynecology & obstetrics":
      case "gynecology":
        return <Baby className="w-8 h-8 text-pink-500" />;
      case "ophthalmology":
        return <Eye className="w-8 h-8 text-sky-500" />;
      case "dentistry":
        return <Smile className="w-8 h-8 text-teal-500" />;
      case "pulmonology":
        return <Activity className="w-8 h-8 text-cyan-500" />;
      case "dermatology":
        return <Sparkles className="w-8 h-8 text-violet-500" />;
      case "ent":
        return <Scissors className="w-8 h-8 text-orange-500" />;
      case "oncology":
        return <ShieldAlert className="w-8 h-8 text-purple-500" />;
      default:
        return <Stethoscope className="w-8 h-8 text-blue-500" />;
    }
  };

  const specialtiesData = [
    { name: "Cardiology", desc: "Heart care and treatments", img: cardiology },
    { name: "Orthopedics", desc: "Bone and joint treatments", img: orthopedics },
    { name: "Neurology", desc: "Brain and nerve care", img: neurology },
    { name: "Pediatrics", desc: "Child healthcare", img: pediatrics },
    { name: "Gynecology & Obstetrics", desc: "Women's and pregnancy care", img: Gynecology },
    { name: "Ophthalmology", desc: "Eye care and vision treatments", img: Ophthalmology },
    { name: "Dentistry", desc: "Oral health and dental surgeries", img: Dentistry },
    { name: "Pulmonology", desc: "Lung and respiratory care", img: Pulmonology },
    { name: "Dermatology", desc: "Skin, hair, and nail treatments", img: Dermatology },
    { name: "ENT", desc: "Ear, nose, and throat treatments", img: ENT },
    { name: "Oncology", desc: "Cancer diagnosis and treatment", img: Oncology },
    { name: "Physiotherapy", desc: "Rehabilitation and physical therapy", img: Physiotherapy }
  ];

  return (
    <div className={pageBackground}>
      
      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-12 pb-16 px-6 md:px-12 lg:px-20 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/30 to-white">
        
        {/* Background Decorative Rings */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-float-reverse"></div>
        
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-8 animate-slide-up">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-extrabold tracking-wider uppercase shadow-sm">
              <Award className="w-4 h-4 text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>World-Class Medical Excellence</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6.5xl font-extrabold leading-tight text-slate-900 tracking-tight">
              Compassionate Care, <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Advanced Medicine.
              </span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl">
              PeopleCare International Hospital brings together board-certified specialists, progressive diagnostics, and clinical compassion to deliver the highest standards of personalized healthcare.
            </p>

            {/* Quick Actions Buttons */}
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleBookAppointment}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-3.5 rounded-full hover:shadow-xl hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-300 text-sm shadow-md"
              >
                Schedule Consultation
              </button>

              <a
                href="#specialties"
                className="border border-slate-200 bg-white/70 backdrop-blur-sm text-slate-800 font-semibold px-8 py-3.5 rounded-full hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all duration-300 text-sm shadow-sm flex items-center gap-2"
              >
                <span>View Departments</span>
                <ChevronRight size={16} />
              </a>
            </div>

            {/* Micro Rating Indicator */}
            <div className="flex items-center gap-6 pt-4 border-t border-slate-100/80 max-w-md">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=64&h=64" alt="patient avatar" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=64&h=64" alt="patient avatar" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=64&h=64" alt="patient avatar" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-slate-800 font-bold text-sm ml-1.5">4.9/5</span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">Based on 8,500+ patient treatment reviews</p>
              </div>
            </div>

          </div>

          {/* RIGHT: CLEAR DOCTOR IMAGE */}
          <div className="lg:col-span-5 relative flex justify-center items-center animate-slide-up" style={{ animationDelay: '150ms' }}>
            <img 
              src={hero} 
              alt="Flying Doctor" 
              className="w-full max-w-sm md:max-w-md object-contain animate-float drop-shadow-2xl" 
            />
          </div>

        </div>
      </section>

      {/* ─── QUICK SEARCH & BOOKING SECTION ─── */}
      <section className="relative z-20 px-6 md:px-12 max-w-7xl mx-auto -mt-10 mb-16">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 md:p-8 shadow-2xl shadow-slate-200/50">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Let's Find a Doctor
              </h2>
              <p className="text-slate-600 text-lg">
                You can find nearest Hospital and Doctors
              </p>
            </div>

            <div className="lg:w-2/3 w-full">
              <form onSubmit={handleQuickBook} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-white rounded-2xl p-4 shadow-lg border border-slate-100">
                
                <div>
                  <input
                    type="text"
                    placeholder="Search by Doctor name"
                    value={searchDoctorName}
                    onChange={(e) => setSearchDoctorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition duration-200"
                  />
                </div>

                <div>
                  <select
                    value={searchSpecialty}
                    onChange={(e) => {
                      setSearchSpecialty(e.target.value);
                      setSearchDocId(""); // Reset doctor selection
                    }}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition duration-200"
                  >
                    <option value="">Department</option>
                    {specialties.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3.5 rounded-xl transition hover:shadow-lg hover:shadow-blue-500/15 active:scale-[0.99] cursor-pointer text-sm"
                >
                  Search
                </button>
              </form>

              {/* Search Results */}
              {(searchDoctorName || searchSpecialty) && (
                <div className="mt-6 space-y-4">
                  {searchResults.length > 0 ? (
                    searchResults.map((doc) => (
                      <div
                        key={doc._id}
                        className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          const token = localStorage.getItem("token");
                          if (!token) {
                            navigate("/login");
                            return;
                          }
                          window.scrollTo(0, 0);
                          navigate("/book-appointment", {
                            state: { 
                              doctorId: doc._id,
                              doctorName: doc.userId?.name,
                              specialization: doc.specialization
                            },
                          });
                        }}
                      >
                        <div className="flex gap-4">
                          {/* Doctor Image */}
                          <div className="shrink-0">
                            <img
                              src={doc.userId?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + doc.userId?.name}
                              alt={doc.userId?.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                            />
                          </div>

                          {/* Doctor Info */}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900">
                              Dr. {doc.userId?.name}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                              {doc.specialization}
                            </p>
                            {doc.qualifications && (
                              <p className="text-xs text-slate-500 mt-1">
                                {Array.isArray(doc.qualifications) ? doc.qualifications.join(" · ") : doc.qualifications}
                              </p>
                            )}
                            {doc.experience && (
                              <p className="text-xs text-slate-500 mt-0.5">
                                Experience: {doc.experience} years
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
                      <p className="text-slate-500 font-medium">No doctors found matching your search.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
          </div>
        </div>
      </section>

      {/* Emergency Strip Removed as per user request */}

      {/* ─── LIVE STATISTICS GRID ─── */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6.5">
          
          <div className="bg-white/60 border border-slate-100 rounded-3xl p-6.5 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">15,000+</h3>
            <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider mt-1">Happy Patients Treated</p>
          </div>

          <div className="bg-white/60 border border-slate-100 rounded-3xl p-6.5 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">120+</h3>
            <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider mt-1">Specialist Doctors</p>
          </div>

          <div className="bg-white/60 border border-slate-100 rounded-3xl p-6.5 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">99.8%</h3>
            <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider mt-1">Accredited Success Rate</p>
          </div>

          <div className="bg-white/60 border border-slate-100 rounded-3xl p-6.5 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">24/7</h3>
            <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider mt-1">Trauma & Support Care</p>
          </div>

        </div>
      </section>

      {/* ─── ABOUT THE HOSPITAL SECTION ─── */}
      <section className="py-20 bg-[#f8fafc] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-40 h-40 bg-blue-100 rounded-3xl -z-10 animate-float"></div>
            <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-indigo-100 rounded-3xl -z-10 animate-float-reverse"></div>
            
            <img
              src="https://www.image2url.com/r2/default/images/1779349432162-fedfc18e-0602-40f7-97e4-ffb6d7b1aea1.jpeg"
              alt="Hospital Facility"
              className="rounded-3xl shadow-xl w-full object-cover aspect-[4/3] border-4 border-white"
            />
          </div>

          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider">
              About PeopleCare
            </div>

            <h2 className="text-3xl md:text-4.5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Legacy of Healthcare Leadership & Patient Trust
            </h2>

            <p className="text-slate-600 leading-relaxed text-base">
              At PeopleCare, we believe in patient-centered healing. We unify advanced clinical research with top-tier healthcare infrastructures to provide customized diagnostic, medical, and post-operative therapeutic treatments.
            </p>

            <ul className="space-y-3">
              {[
                "Highly experienced board-certified clinicians and surgeons",
                "Advanced multi-specialty hybrid operating theaters",
                "ISO certified diagnostic laboratories and imaging scanners",
                "Dedicated homecare, physical rehabilitation, and teleconsultation"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-700 text-sm">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-2">
              <button onClick={() => navigate("/about")} className="bg-slate-900 text-white hover:bg-slate-800 font-bold px-8 py-3 rounded-full transition shadow-sm active:scale-[0.98]">
                Read More
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ─── SPECIALIZATIONS SECTION ─── */}
      <span id="specialties"></span>
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-3.5 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider">
            Our Specialty Clinics
          </div>
          <h2 className="text-3xl md:text-4.5xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Medical Disciplines
          </h2>
          <p className="text-slate-500 leading-relaxed text-base">
            Providing industry-leading treatment options through dedicated expert panels and highly specialized diagnostics.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {specialtiesData.map((spec, index) => (
            <div
              key={index}
              onClick={() => navigate("/doctors", { state: { specialization: spec.name } })}
              className="group bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl p-6.5 hover:shadow-2xl hover:shadow-slate-100 hover:border-blue-200 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                
                {/* Specialty Header */}
                <div className="flex justify-between items-start mb-5">
                  <div className="w-14 h-14 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300">
                    {getSpecialtyIcon(spec.name)}
                  </div>
                  
                  {/* Miniature decorative specialization tag */}
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border px-2 py-0.5 rounded-full uppercase tracking-wider group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors duration-300">
                    Clinic
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors duration-200">
                  {spec.name}
                </h3>
                
                <p className="text-slate-500 text-xs.5 leading-relaxed mt-2 line-clamp-2">
                  {spec.desc}
                </p>

              </div>

              {/* Action Link */}
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs.5 font-bold text-slate-500 group-hover:text-blue-600 transition-colors duration-200">
                <span>Find Doctors</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* ─── TESTIMONIALS CAROUSEL ─── */}
      <section className="py-24 bg-gradient-to-b from-[#f8fafc] to-[#ffffff] border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          
          <div className="space-y-4">
            <div className="inline-block px-3.5 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider">
              Patient Feedback
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Stories of Recovery & Healing
            </h2>
          </div>

          {/* Testimonial Active Slide Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-100/50 relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-serif text-3xl font-bold shadow-lg shadow-blue-500/20">
              “
            </div>

            <div className="space-y-6 mt-4">
              
              {/* Stars */}
              <div className="flex justify-center gap-1">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, idx) => (
                  <Star key={idx} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-slate-600 italic text-base md:text-lg leading-relaxed font-medium">
                "{testimonials[activeTestimonial].content}"
              </p>

              {/* Patient Bio */}
              <div className="flex flex-col items-center gap-3.5 pt-4">
                <img
                  src={testimonials[activeTestimonial].image}
                  alt={testimonials[activeTestimonial].name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-50 shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-base leading-none">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>
              </div>

            </div>

            {/* Slider Navigation arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-3 md:-left-6">
              <button
                onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="w-11 h-11 bg-white hover:bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-lg transition active:scale-95"
              >
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-3 md:-right-6">
              <button
                onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="w-11 h-11 bg-white hover:bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-lg transition active:scale-95"
              >
                <ChevronRight size={18} className="text-slate-600" />
              </button>
            </div>

          </div>

          {/* Slider Indicators dots */}
          <div className="flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeTestimonial === index 
                    ? "bg-blue-600 w-6" 
                    : "bg-slate-200 hover:bg-slate-300"
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ─── INTERACTIVE FAQ ACCORDION ─── */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-3.5 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider">
            Patient Support
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 leading-relaxed text-sm.5">
            Quick responses to essential guidelines regarding doctor consultation, scheduling, and medical records.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6.5 py-5 text-left flex justify-between items-center gap-4 hover:bg-slate-50/50 transition-colors duration-200"
                >
                  <span className="font-bold text-slate-800 text-sm.5 md:text-base leading-snug">
                    {faq.question}
                  </span>
                  
                  <span className={`w-8 h-8 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center transition-transform duration-300 ${
                    isOpen ? "rotate-180 bg-blue-50 text-blue-600" : ""
                  }`}>
                    <ChevronDown size={16} />
                  </span>
                </button>
                
                {/* Smooth Expand content */}
                <div className={`transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[250px] border-t border-slate-50 py-5 px-6.5 bg-[#fbfcfe]" : "max-h-0 pointer-events-none"
                } overflow-hidden`}>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
}

export default Home;