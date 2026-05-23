import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import {
  Users,
  UserRound,
  ShieldCheck,
  Trash2,
  Stethoscope,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  UserCircle,
  CheckCircle,
  Download,
  Search,
  LogOut,
  Ban,
  Check,
  Plus,
  X,
  Key,
  Menu
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../store/authStore";
import AdminOverview from "./admin/AdminOverview";
import AdminDoctorsList from "./admin/AdminDoctorsList";
import AdminPatientsList from "./admin/AdminPatientsList";
import AdminAppointmentsList from "./admin/AdminAppointmentsList";
import AdminPrescriptionsList from "./admin/AdminPrescriptionsList";
import AdminAddDoctorModal from "./admin/AdminAddDoctorModal";
import {
  bodyFont,
  headingFont,
  adminSidebarBg,
  adminActiveTab,
  adminInactiveTab,
  adminPrimaryBtn,
  adminSecondaryBtn,
  adminRedBtn,
  adminGreenBtn,
  metricCard,
  metricCardPending
} from "../styles/Common.js";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [recentUsers, setRecentUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalPrescriptions: 0,
    pendingVerifications: 1,
  });

  // Direct Doctor Creation State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    dob: "",
    specialization: "",
    experience: "",
    qualification: "",
    availableDays: [],
    availableTime: ""
  });


  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$*";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewDoctor(prev => ({ ...prev, password }));
  };

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    if (newDoctor.availableDays.length === 0) {
      toast.error("Please select at least one available day.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("/admin-api/create-doctor", newDoctor);
      toast.success(res.data.message);
      
      setShowAddModal(false);
      setNewDoctor({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        dob: "",
        specialization: "",
        experience: "",
        qualification: "",
        availableDays: [],
        availableTime: ""
      });
      
      // Refresh lists
      getDoctors();
      getStats();
      getRecentUsers();
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to create doctor profile.");
      setLoading(false);
    }
  };

  // FETCH STATS
  const getStats = useCallback(async () => {
    try {
      const res = await axios.get("/admin-api/stats");
      setStats(res.data.payload);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch stats");
    }
  }, []);

  // FETCH RECENT USERS
  const getRecentUsers = useCallback(async () => {
    try {
      const res = await axios.get(
        "/admin-api/recent-users"
      );
      setRecentUsers(res.data.payload);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch recent users");
    }
  }, []);

  // FETCH ALL DOCTORS
  const getDoctors = useCallback(async () => {
    try {
      const res = await axios.get(
        "/admin-api/doctors"
      );
      setDoctors(res.data.payload);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch doctors");
    }
  }, []);

  // FETCH ALL PATIENTS
  const getPatients = useCallback(async () => {
    try {
      const res = await axios.get(
        "/admin-api/patients"
      );
      setPatients(res.data.payload);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch patients");
    }
  }, []);
  
  // FETCH ALL APPOINTMENTS
  const getAppointments = useCallback(async () => {
    try {
      const res = await axios.get(
        "/admin-api/all-appointments"
      );
      setAppointments(res.data.payload);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch appointments");
    }
  }, []);
  
  // FETCH ALL PRESCRIPTIONS
  const getPrescriptions = useCallback(async () => {
    try {
      const res = await axios.get(
        "/admin-api/all-prescriptions"
      );
      setPrescriptions(res.data.payload);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch prescriptions");
    }
  }, []);

  // TOGGLE USER STATUS
  const toggleUserStatus = async (id, role) => {
    try {
      setLoading(true);
      const endpoint = role === "DOCTOR" ? `/admin-api/doctor/${id}` : `/admin-api/patient/${id}`;
      
      const res = await axios.put(`${endpoint}`);
      
      toast.success(res.data.message);
      
      getRecentUsers();
      getDoctors();
      getPatients();
      getStats(); // Refresh stats after status update
      
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update user status");
      setLoading(false);
    }
  };

  // DOWNLOAD PRESCRIPTION
  const downloadPrescription = async (prescriptionId) => {
    try {
      const response = await axios.get(
        `/prescription-api/${prescriptionId}/pdf`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription-${prescriptionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Prescription downloaded successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to download prescription PDF");
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      getStats();
      getRecentUsers();
      getDoctors();
      getPatients();
      getAppointments();
      getPrescriptions();
    });
  }, [getStats, getRecentUsers, getDoctors, getPatients, getAppointments, getPrescriptions]);

  // RESET SEARCH QUERY ON TAB CHANGE
  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

  // GET FORMATTED DATE FOR HEADER
  const getHeaderDate = () => {
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return new Date().toLocaleDateString('en-US', options);
  };

  // RENDER SEARCH BAR
  const renderSearchBar = (placeholder) => (
    <div className="relative max-w-sm mb-6">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-white border border-[#d2d2d7] rounded-xl pl-10 pr-4 py-2 text-[13px] text-[#1d1d1f] placeholder:text-[#a1a1a6] focus:outline-none focus:border-[#0071e3] transition"
      />
    </div>
  );

  // VIEW RENDERERS
  const renderDashboard = () => (
    <AdminOverview
      stats={stats}
      recentUsers={recentUsers}
      setActiveTab={setActiveTab}
      toggleUserStatus={toggleUserStatus}
      loading={loading}
    />
  );



  const renderProfile = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8ed] p-8 max-w-xl">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 bg-[#0071e3] rounded-full flex items-center justify-center text-white text-[24px] font-bold">
          {user?.name?.charAt(0)?.toUpperCase() || "A"}
        </div>
        <div>
          <h2 className={`text-[20px] font-bold ${headingFont}`}>{user?.name || "Admin"}</h2>
          <p className="text-gray-400 text-[12px]">System Administrator</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-3 py-3 border-t border-[#e8e8ed] text-[13px]">
          <div className="text-gray-400 font-medium">Email Address</div>
          <div className="col-span-2 text-[#1d1d1f] font-semibold">{user?.email || "admin@example.com"}</div>
        </div>
        <div className="grid grid-cols-3 py-3 border-t border-[#e8e8ed] text-[13px]">
          <div className="text-gray-400 font-medium">Role</div>
          <div className="col-span-2 text-[#1d1d1f] font-semibold">ADMINISTRATOR</div>
        </div>
        <div className="grid grid-cols-3 py-3 border-t border-[#e8e8ed] text-[13px]">
          <div className="text-gray-400 font-medium">Status</div>
          <div className="col-span-2 text-green-600 font-bold flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
             Active
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return renderDashboard();
      case "doctors": return (
        <AdminDoctorsList
          doctors={doctors}
          searchQuery={searchQuery}
          loading={loading}
          toggleUserStatus={toggleUserStatus}
          setShowAddModal={setShowAddModal}
          searchBarComponent={renderSearchBar("Search doctors...")}
        />
      );
      case "patients": return (
        <AdminPatientsList
          patients={patients}
          searchQuery={searchQuery}
          loading={loading}
          toggleUserStatus={toggleUserStatus}
          searchBarComponent={renderSearchBar("Search patients...")}
        />
      );
      case "appointments": return (
        <AdminAppointmentsList
          appointments={appointments}
          searchQuery={searchQuery}
          searchBarComponent={renderSearchBar("Search doctor or patient...")}
        />
      );
      case "prescriptions": return (
        <AdminPrescriptionsList
          prescriptions={prescriptions}
          searchQuery={searchQuery}
          downloadPrescription={downloadPrescription}
          searchBarComponent={renderSearchBar("Search doctor, patient or diagnosis...")}
        />
      );
      case "profile": return renderProfile();
      default: return renderDashboard();
    }
  };

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Dashboard";
      case "doctors": return "Manage Doctors";
      case "patients": return "Manage Patients";
      case "appointments": return "Appointments";
      case "prescriptions": return "Prescriptions";
      case "profile": return "Profile";
      default: return "Admin Portal";
    }
  };

  return (
    <div className={`min-h-screen bg-[#fafafa] flex flex-col md:flex-row antialiased ${bodyFont}`}>
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 md:relative md:w-60 flex flex-col shrink-0 p-5 ${adminSidebarBg} transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 h-full overflow-y-auto shadow-2xl md:shadow-none`}>
        
        {/* MOBILE CLOSE BUTTON */}
        <button 
          className="md:hidden absolute top-5 right-5 text-gray-500 hover:text-gray-800"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={20} />
        </button>
        
        {/* LOGO AREA */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-[#0071e3] rounded-xl flex items-center justify-center text-white">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h1 className={`text-[14px] font-bold tracking-tight leading-tight ${headingFont}`}>People Care</h1>
            <p className="text-[9px] text-[#86868b] font-bold uppercase tracking-wider leading-none">International Hospital</p>
          </div>
        </div>

        {/* ADMIN HEADER */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-1 border-b border-[#e8e8ed]">
            Admin
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 space-y-1">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition font-semibold text-[13px] ${
              activeTab === "dashboard" ? adminActiveTab : adminInactiveTab
            }`}
          >
            <LayoutDashboard size={15} />
            Dashboard
          </button>

          <button
            onClick={() => {
              setActiveTab("doctors");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition font-semibold text-[13px] ${
              activeTab === "doctors" ? adminActiveTab : adminInactiveTab
            }`}
          >
            <Stethoscope size={15} />
            Manage Doctors
          </button>

          <button
            onClick={() => {
              setActiveTab("patients");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition font-semibold text-[13px] ${
              activeTab === "patients" ? adminActiveTab : adminInactiveTab
            }`}
          >
            <Users size={15} />
            Manage Patients
          </button>

          <button
            onClick={() => {
              setActiveTab("appointments");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition font-semibold text-[13px] ${
              activeTab === "appointments" ? adminActiveTab : adminInactiveTab
            }`}
          >
            <Calendar size={15} />
            Appointments
          </button>

          <button
            onClick={() => {
              setActiveTab("prescriptions");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition font-semibold text-[13px] ${
              activeTab === "prescriptions" ? adminActiveTab : adminInactiveTab
            }`}
          >
            <ClipboardList size={15} />
            Prescriptions
          </button>

          <button
            onClick={() => {
              setActiveTab("profile");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition font-semibold text-[13px] ${
              activeTab === "profile" ? adminActiveTab : adminInactiveTab
            }`}
          >
            <UserCircle size={15} />
            Profile
          </button>
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="pt-4 border-t border-[#e8e8ed] mt-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#0071e3] text-white flex items-center justify-center font-bold text-[12px] uppercase">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-[#1d1d1f] text-[12px] leading-tight">{user?.name || "Dr. Aman Mehta"}</div>
              <div className="text-[10px] text-gray-400 font-normal leading-tight">{user?.email || "admin@peoplecare.com"}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 border border-[#d2d2d7] hover:bg-[#f5f5f7] text-[#1d1d1f] rounded-xl py-2 text-[12px] font-semibold transition"
          >
            <LogOut size={13} />
            Logout
          </button>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-auto bg-[#fafafa]">
        
        {/* TOP BAR / PORTAL HEADER */}
        <header className="px-6 md:px-10 py-4 bg-white border-b border-[#e8e8ed] flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 rounded-lg bg-gray-50 text-gray-600 border border-gray-200"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Admin Portal</p>
              <h2 className="text-[14px] font-bold text-[#1d1d1f] mt-1">{getActiveTabTitle()}</h2>
            </div>
          </div>
          <div className="hidden sm:block border border-[#d2d2d7] rounded-full px-3 py-1 text-[11px] text-gray-500 font-medium bg-[#fafafa]">
            {getHeaderDate()}
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>

      </div>

      {/* ADD DOCTOR MODAL */}
      {showAddModal && (
        <AdminAddDoctorModal
          newDoctor={newDoctor}
          setNewDoctor={setNewDoctor}
          handleCreateDoctor={handleCreateDoctor}
          loading={loading}
          generateRandomPassword={generateRandomPassword}
          setShowAddModal={setShowAddModal}
        />
      )}
    </div>
  );
}

export default AdminDashboard;