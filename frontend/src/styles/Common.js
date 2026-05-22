// src/styles/common.js
// Premium Healthcare-inspired UI System
// Clean typography • subtle interactions • glassmorphism & gradients

// ─── Layout ───────────────────────────────────────────
export const pageBackground = "bg-gradient-to-b from-[#f5f8ff] via-[#fafbfc] to-[#ffffff] min-h-screen"
export const pageWrapper    = "max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24"
export const section        = "mb-20"
export const container      = "max-w-7xl mx-auto px-6"

// ─── Cards ────────────────────────────────────────────
export const cardClass =
"bg-white/70 backdrop-blur-md border border-blue-50/50 rounded-3xl p-8 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"

export const elevatedCard =
"bg-white border border-gray-100 rounded-3xl p-8 hover:scale-[1.02] shadow-sm hover:shadow-xl transition-all duration-300"

// ─── Typography ───────────────────────────────────────
export const pageTitleClass =
"text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4 font-['Outfit',sans-serif] bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent"

export const headingClass =
"text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight font-['Outfit',sans-serif] leading-tight"

export const subHeadingClass =
"text-xl font-bold text-gray-900 tracking-tight font-['Outfit',sans-serif]"

export const bodyText =
"text-gray-600 leading-relaxed text-[1rem]"

export const mutedText =
"text-sm text-gray-400"

export const linkClass =
"text-blue-600 hover:text-blue-800 font-semibold transition-colors"

// ─── Buttons ──────────────────────────────────────────
export const primaryBtn =
"bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-3 rounded-full hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer text-sm"

export const secondaryBtn =
"border border-gray-200 bg-white text-gray-800 font-semibold px-8 py-3 rounded-full hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all duration-200 text-sm"

export const ghostBtn =
"text-blue-600 font-semibold hover:text-blue-800 transition text-sm flex items-center gap-1"

// ─── Forms ────────────────────────────────────────────
export const formCard =
"bg-white/80 backdrop-blur-lg border border-white/50 rounded-3xl p-10 max-w-md mx-auto shadow-2xl shadow-gray-100"

export const formTitle =
"text-3xl font-extrabold text-gray-900 tracking-tight text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"

export const labelClass =
"text-xs font-bold text-gray-500 mb-1.5 block tracking-wide uppercase"

export const inputClass =
"w-full bg-white/70 border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all duration-200"

export const formGroup = "mb-6"

export const submitBtn =
"w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-2xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] transition-all duration-200 cursor-pointer text-sm"

// ─── Navbar ───────────────────────────────────────────
export const navbarClass =
"bg-white/80 backdrop-blur-xl border-b border-gray-100/80 px-8 h-[80px] flex items-center sticky top-0 z-50 shadow-sm"

export const navContainerClass =
"max-w-7xl mx-auto w-full flex items-center justify-between"

export const navBrandClass =
"text-xl font-extrabold text-blue-600 tracking-tight flex items-center gap-2"

export const navLinksClass =
"flex items-center gap-8"

export const navLinkClass =
"text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"

export const navLinkActiveClass =
"text-sm text-[#0071e3] font-medium"

// ─── Blog / Article Cards ─────────────────────────────
export const articleGrid =
"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"

export const articleCardClass =
"bg-white border border-[#e8e8ed] rounded-2xl p-7 hover:border-[#d2d2d7] transition cursor-pointer flex flex-col gap-3"

export const articleTitle =
"text-lg font-semibold text-[#1d1d1f] tracking-tight"

export const articleExcerpt =
"text-sm text-[#515154] leading-relaxed"

export const articleMeta =
"text-xs text-[#86868b]"

export const articleBody =
"text-[#515154] leading-relaxed text-[0.95rem] max-w-2xl"

export const timestampClass =
"text-xs text-[#86868b] flex items-center gap-1"

export const tagClass =
"text-[0.7rem] font-semibold text-[#0071e3] uppercase tracking-widest"

// ─── Feedback ─────────────────────────────────────────
export const errorClass =
"bg-[#ff3b30]/10 text-[#cc2f26] border border-[#ff3b30]/30 rounded-xl px-4 py-3 text-sm"

export const successClass =
"bg-[#34c759]/10 text-[#248a3d] border border-[#34c759]/30 rounded-xl px-4 py-3 text-sm"

export const loadingClass =
"text-[#0071e3]/60 text-sm animate-pulse text-center py-10"

export const emptyStateClass =
"text-center text-[#86868b] py-16 text-sm"

// ─── Divider ──────────────────────────────────────────
export const divider =
"border-t border-[#e8e8ed] my-12"

// ─── Admin Dashboard Styles ──────────────────────────
export const bodyFont = "font-['Plus_Jakarta_Sans',sans-serif] antialiased text-[13px] text-[#1d1d1f]"
export const headingFont = "font-['Outfit',sans-serif] text-[#1d1d1f]"

export const adminSidebarBg = "bg-white border-r border-[#e8e8ed]"
export const adminActiveTab = "bg-[#0071e3] text-white shadow-sm"
export const adminInactiveTab = "text-[#6e6e73] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
export const adminPrimaryBtn = "bg-[#0071e3] hover:bg-[#005bb5] text-white"
export const adminSecondaryBtn = "border border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7]"
export const adminRedBtn = "border border-[#ff3b30]/30 hover:bg-[#ff3b30]/10 text-[#cc2f26]"
export const adminGreenBtn = "bg-[#34c759] hover:bg-[#248a3d] text-white"

export const metricCard = "bg-white rounded-xl shadow-sm p-4 border border-[#e8e8ed] flex flex-col justify-between"
export const metricCardPending = "bg-white rounded-xl shadow-sm p-4 border border-[#ff9500]/30 flex flex-col justify-between"