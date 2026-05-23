import React from "react";
import {
  Stethoscope,
  Heart,
  Activity,
  Brain,
  Baby,
  Eye,
  Smile,
  Sparkles,
  Scissors,
  ShieldAlert,
} from "lucide-react";

export const findMatchingSpecialty = (stateSpec, dbSpecs) => {
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

export const getSpecialtyIcon = (name, sizeClass = "w-3.5 h-3.5") => {
  if (!name)
    return <Stethoscope className={`${sizeClass} text-blue-500`} />;

  switch (name.toLowerCase()) {
    case "cardiology":
      return <Heart className={`${sizeClass} text-rose-500`} />;
    case "orthopedics":
      return <Activity className={`${sizeClass} text-emerald-500`} />;
    case "neurology":
      return <Brain className={`${sizeClass} text-indigo-500`} />;
    case "pediatrics":
      return <Baby className={`${sizeClass} text-amber-500`} />;
    case "gynecology":
    case "gynecology & obstetrics":
      return <Baby className={`${sizeClass} text-pink-500`} />;
    case "ophthalmology":
      return <Eye className={`${sizeClass} text-sky-500`} />;
    case "dentistry":
      return <Smile className={`${sizeClass} text-teal-500`} />;
    case "pulmonology":
      return <Activity className={`${sizeClass} text-cyan-500`} />;
    case "dermatology":
      return <Sparkles className={`${sizeClass} text-violet-500`} />;
    case "ent":
      return <Scissors className={`${sizeClass} text-orange-500`} />;
    case "oncology":
      return <ShieldAlert className={`${sizeClass} text-purple-500`} />;
    case "physiotherapy":
      return <Activity className={`${sizeClass} text-emerald-500`} />;
    default:
      return <Stethoscope className={`${sizeClass} text-blue-500`} />;
  }
};
