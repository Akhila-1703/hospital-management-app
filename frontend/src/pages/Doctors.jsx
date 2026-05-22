import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Stethoscope,
  Award,
  Mail,
  Sparkles,
  ChevronRight,
  Filter,
  Heart,
  Brain,
  Baby,
  Eye,
  Smile,
  Scissors,
  ShieldAlert,
  Activity,
  MapPin,
  Clock,
  Calendar,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../store/authStore";

// Helper to fuzzy-match requested specialties
const findMatchingSpecialty = (stateSpec, dbSpecs) => {
  if (!stateSpec || stateSpec === "All") return "All";

  const normalizedState = stateSpec.toLowerCase();

  const matched = dbSpecs.find((spec) => {
    const s = spec.toLowerCase();

    return (
      s === normalizedState ||
      s.includes(normalizedState) ||
      normalizedState.includes(s) ||
      (normalizedState.includes("cardio") && s.includes("cardio")) ||
      (normalizedState.includes("neuro") && s.includes("neuro")) ||
      (normalizedState.includes("ortho") && s.includes("ortho")) ||
      (normalizedState.includes("pediat") && s.includes("pediat")) ||
      (normalizedState.includes("gyne") && s.includes("gyne")) ||
      (normalizedState.includes("dent") && s.includes("dent")) ||
      (normalizedState.includes("dermat") && s.includes("dermat")) ||
      (normalizedState.includes("oncolog") && s.includes("oncolog")) ||
      (normalizedState.includes("pulmon") && s.includes("pulmon")) ||
      (normalizedState.includes("physio") && s.includes("physio")) ||
      (normalizedState.includes("ent") && s.includes("ent"))
    );
  });

  return matched || "All";
};

const getSpecialtyIcon = (name) => {
  if (!name)
    return <Stethoscope className="w-3.5 h-3.5 text-blue-500" />;

  switch (name.toLowerCase()) {
    case "cardiology":
      return <Heart className="w-3.5 h-3.5 text-rose-500" />;

    case "orthopedics":
      return <Activity className="w-3.5 h-3.5 text-emerald-500" />;

    case "neurology":
      return <Brain className="w-3.5 h-3.5 text-indigo-500" />;

    case "pediatrics":
      return <Baby className="w-3.5 h-3.5 text-amber-500" />;

    case "gynecology":
    case "gynecology & obstetrics":
      return <Baby className="w-3.5 h-3.5 text-pink-500" />;

    case "ophthalmology":
      return <Eye className="w-3.5 h-3.5 text-sky-500" />;

    case "dentistry":
      return <Smile className="w-3.5 h-3.5 text-teal-500" />;

    case "pulmonology":
      return <Activity className="w-3.5 h-3.5 text-cyan-500" />;

    case "dermatology":
      return <Sparkles className="w-3.5 h-3.5 text-violet-500" />;

    case "ent":
      return <Scissors className="w-3.5 h-3.5 text-orange-500" />;

    case "oncology":
      return <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />;

    case "physiotherapy":
      return <Activity className="w-3.5 h-3.5 text-emerald-500" />;

    default:
      return <Stethoscope className="w-3.5 h-3.5 text-blue-500" />;
  }
};

const STANDARD_SPECIALTIES = [
  "All",
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "Pediatrics",
  "Gynecology & Obstetrics",
  "Ophthalmology",
  "Dentistry",
  "Pulmonology",
  "Dermatology",
  "ENT",
  "Oncology",
  "Physiotherapy",
];

function Doctors() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchDoctors = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/common-api/doctors"
        );

        const docList = res.data.payload || [];

        setDoctors(docList);
        setFilteredDoctors(docList);

        const dbSpecs = docList
          .map((doc) => doc.specialization)
          .filter(Boolean);

        const uniqueSpecs = [
          ...STANDARD_SPECIALTIES,
          ...new Set(
            dbSpecs.filter(
              (spec) =>
                !STANDARD_SPECIALTIES.some(
                  (s) => s.toLowerCase() === spec.toLowerCase()
                )
            )
          ),
        ];

        setSpecialties(uniqueSpecs);
      } catch (err) {
        console.error(
          "Error fetching doctors:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (specialties.length > 0) {
      const stateSpec = location.state?.specialization || "All";

      const matched = findMatchingSpecialty(
        stateSpec,
        specialties
      );

      setSelectedSpecialty(matched);
    }
  }, [location.state, specialties]);

  useEffect(() => {
    let filtered = doctors;

    if (selectedSpecialty !== "All") {
      filtered = filtered.filter((doc) => {
        const docSpec = doc.specialization?.toLowerCase() || "";
        const selected = selectedSpecialty.toLowerCase();

        return (
          docSpec === selected ||
          docSpec.includes(selected) ||
          selected.includes(docSpec) ||
          (selected.includes("gynecology") &&
            docSpec.includes("gynecology")) ||
          (selected.includes("ent") && docSpec.includes("ent"))
        );
      });
    }

    if (search.trim() !== "") {
      filtered = filtered.filter((doc) =>
        `${doc.userId?.name} ${doc.specialization} ${doc.qualification}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  }, [search, selectedSpecialty, doctors]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-[#f5f8ff] to-white">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4"></div>

        <p className="text-slate-600 font-bold animate-pulse text-sm">
          Loading Specialist Roster...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f5f8ff] via-[#fafbfc] to-white px-6 md:px-16 py-16 md:py-24">

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} className="animate-pulse" />
          <span>Our Clinical Leadership</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Meet Our Certified Specialists
        </h1>

        <p className="text-slate-500 text-base md:text-lg leading-relaxed">
          Access high-caliber diagnostic expertise and compassionate healthcare.
        </p>
      </div>

      {/* SEARCH */}
      <div className="max-w-5xl mx-auto mt-12 space-y-6">

        <div className="relative max-w-xl mx-auto">
          <Search
            className="absolute left-4 top-4 text-slate-400"
            size={19}
          />

          <input
            type="text"
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* SPECIALTY TABS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">

          <div className="text-slate-500 flex items-center gap-1 text-xs font-bold uppercase">
            <Filter size={14} />
            Specialty
          </div>

          {specialties.map((spec) => {
            const isSelected = selectedSpecialty === spec;

            return (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                {spec}
              </button>
            );
          })}
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center mt-20">
          <h2 className="text-2xl font-bold text-slate-800">
            No Doctors Found
          </h2>
        </div>
      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">

          {filteredDoctors.map((doc) => (

            <div
              key={doc._id}
              className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition"
            >

              {/* TOP */}
              <div className="flex items-center gap-4">

                <img
                  src={
                    doc.profileImage
                      ? doc.profileImage.startsWith("http")
                        ? doc.profileImage
                        : `http://localhost:4000${doc.profileImage}`
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={doc.userId?.name}
                  className="w-20 h-20 rounded-2xl object-cover border"
                />

                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Dr. {doc.userId?.name || "N/A"}
                  </h2>

                  <p className="text-blue-600 font-bold text-xs mt-1 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md inline-flex items-center gap-1">
                    {getSpecialtyIcon(doc.specialization)}
                    <span>
                      {doc.specialization || "General Physician"}
                    </span>
                  </p>
                </div>
              </div>

              {/* DETAILS */}
              <div className="mt-6 border-t border-slate-100 pt-6 space-y-4">

                <p className="text-slate-500 text-sm italic">
                  "{doc.bio || "Dedicated to patient care."}"
                </p>

                {/* Qualification */}
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Award size={15} />
                  </div>

                  <div>
                    <p className="font-bold text-slate-800">
                      {doc.qualification || "MBBS"}
                    </p>

                    <p className="text-xs text-slate-500">
                      {doc.experience || 5}+ Years Experience
                    </p>
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-3">

                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Clock size={15} />
                    </div>

                    <div>
                      <p className="font-bold text-slate-800">
                        Available Days
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-1">

                        {doc.availableDays?.length > 0 ? (

                          doc.availableDays.map((day, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100"
                            >
                              {day}
                            </span>
                          ))

                        ) : (

                          <span className="text-xs text-slate-500">
                            Not Updated
                          </span>

                        )}

                      </div>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-3 text-sm">

                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Calendar size={15} />
                    </div>

                    <div>
                      <p className="font-bold text-slate-800">
                        Consultation Hours
                      </p>

                      <p className="text-xs text-slate-500">
                        {doc.availableTime || "Not Updated"}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 text-sm">

                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <MapPin size={15} />
                    </div>

                    <div>
                      <p className="font-bold text-slate-800">
                        {doc.clinicName || "PeopleCare Main Hospital"}
                      </p>

                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Mail size={12} />

                        <span>
                          {doc.userId?.email || "Contact via portal"}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* BUTTON */}
                <div className="pt-4">

                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate("/login");
                      } else if (
                        currentUser?.role === "PATIENT"
                      ) {
                        navigate("/patient-dashboard", {
                          state: { doctorId: doc._id },
                        });
                      } else {
                        alert(
                          "Only patients can book appointments."
                        );
                      }
                    }}
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
                  >
                    <span>Request Appointment</span>
                    <ChevronRight size={15} />
                  </button>

                </div>
              </div>
            </div>

          ))}

        </div>
      )}
    </div>
  );
}

export default Doctors;