import React, { useEffect } from 'react';
import { pageBackground } from '../styles/common';
import { Award, ShieldAlert, Heart, Activity } from 'lucide-react';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-20 ${pageBackground}`}>
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl border border-slate-100 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50">
        
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            About Our Institution
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            PeopleCare International Hospital
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed mt-4 max-w-3xl mx-auto">
            A Legacy of Healthcare Leadership & Patient Trust
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <img
            src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800"
            alt="Hospital Facility"
            className="rounded-3xl shadow-xl w-full object-cover aspect-[4/3]"
          />
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed text-base">
              At PeopleCare, we believe in patient-centered healing. We unify advanced clinical research with top-tier healthcare infrastructures to provide customized diagnostic, medical, and post-operative therapeutic treatments.
            </p>
            <p className="text-slate-600 leading-relaxed text-base">
              Our team of highly experienced, board-certified clinicians, surgeons, and healthcare professionals work tirelessly to ensure the best possible outcomes for our patients. We believe in a patient-centered approach, tailoring our treatments to meet the unique needs of each individual.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
            <Award className="w-10 h-10 text-blue-600 mx-auto mb-4" />
            <h3 className="font-bold text-slate-800 mb-2">Excellence</h3>
            <p className="text-sm text-slate-500">Highest standards in clinical care and safety.</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
            <Heart className="w-10 h-10 text-rose-500 mx-auto mb-4" />
            <h3 className="font-bold text-slate-800 mb-2">Compassion</h3>
            <p className="text-sm text-slate-500">Empathy, dignity, and respect for all.</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
            <Activity className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
            <h3 className="font-bold text-slate-800 mb-2">Innovation</h3>
            <p className="text-sm text-slate-500">Continuous adoption of medical advancements.</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
            <ShieldAlert className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
            <h3 className="font-bold text-slate-800 mb-2">Integrity</h3>
            <p className="text-sm text-slate-500">Transparency and honesty in medical practices.</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default About;
