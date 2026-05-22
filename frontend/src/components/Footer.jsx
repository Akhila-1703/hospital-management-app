import React from "react";
import { Link } from "react-router";
import { 
  Activity, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send
} from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to our health newsletter!");
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 mt-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* COLUMN 1: BRANDING & BIO */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center border border-blue-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                PeopleCare
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-0.5">
                International Hospital
              </p>
            </div>
          </div>
          
          <p className="text-sm text-slate-400 leading-relaxed">
            Providing high-quality and compassionate healthcare since 2012. Our global medical team is equipped with the latest diagnostic and therapeutic technologies.
          </p>
          
          {/* SOCIAL LINKS - Inline SVGs for brand reliability */}
          <div className="flex items-center gap-3.5 pt-2">
            <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h3v-9h2.72l.42-3H12V6.62c0-.88.21-1.33 1.11-1.33H14V2h-2.4C9.28 2 8 3.5 8 5.76V8z"/>
              </svg>
            </a>
            <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-blue-400 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-pink-600 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-blue-700 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* COLUMN 2: LOCATIONS */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Our Locations
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-500 shrink-0" />
              <span>Hyderabad, Telangana</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-500 shrink-0" />
              <span>Warangal, Telangana</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-500 shrink-0" />
              <span>Karimnagar, Telangana</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-500 shrink-0" />
              <span>Nizamabad, Telangana</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-500 shrink-0" />
              <span>Khammam, Telangana</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-500 shrink-0" />
              <span>Vijayawada, Andhra Pradesh</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-500 shrink-0" />
              <span>Visakhapatnam, Andhra Pradesh</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-500 shrink-0" />
              <span>Guntur, Andhra Pradesh</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-500 shrink-0" />
              <span>Tirupati, Andhra Pradesh</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-500 shrink-0" />
              <span>Kakinada, Andhra Pradesh</span>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: CONTACT & HOURS */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Contact & Timings
          </h4>
          <ul className="space-y-3.5 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <span>245 Health Avenue, Jubilee Hills, Hyderabad</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-blue-500 shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-blue-500 shrink-0" />
              <span>support@peoplecarehospital.com</span>
            </li>
            <li className="flex items-start gap-3 pt-2 border-t border-slate-800">
              <Clock size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Emergency Services: 24/7</p>
                <p className="text-xs text-slate-500 mt-0.5">Regular OPD: 09:00 AM - 08:00 PM</p>
              </div>
            </li>
          </ul>
        </div>

        {/* COLUMN 4: NEWSLETTER & CREDENTIALS */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Health Newsletter
          </h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            Subscribe to our weekly newsletter for wellness tips and medical breakthrough stories.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input 
              type="email" 
              required
              placeholder="Your email address"
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
            />
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition duration-200 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.97]"
            >
              <Send size={16} />
            </button>
          </form>
          
          <p className="text-xs text-slate-500 italic">
            ISO 9001:2015 & NABH Accredited Medical Center.
          </p>
        </div>

      </div>

      {/* SUB-FOOTER */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
        <p>© {currentYear} PeopleCare Hospital. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Patient Rights</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;