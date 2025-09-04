'use client';

export default function StartSellingCTA() {
  return (
    <section className="py-24 px-6 sm:px-10 lg:px-20 bg-gradient-to-br from-slate-900 via-purple-950/50 to-slate-950 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-gradient-to-br from-purple-600/20 to-pink-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/10 to-cyan-600/5 rounded-full blur-3xl"></div>

      {/* Floating Abstract Shapes */}
      <div className="absolute top-1/4 left-10 w-4 h-4 border border-purple-500 rounded rotate-45 animate-pulse"></div>
      <div className="absolute top-3/4 right-20 w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-2 h-6 border-l-2 border-cyan-400 rotate-45 opacity-30"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Main Headline */}
        <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent leading-tight mb-6">
          Turn Your Code <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">into Income</span>
        </h2>

        {/* Subhead */}
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          Stop letting your side projects sit idle. Upload once, set your price, and start earning passive income from developers who need your work.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            🚀 Start Selling Your Projects
          </button>
          <div className="text-sm text-gray-400 hover:text-gray-200 transition-colors cursor-pointer underline-offset-4 hover:underline">
            Learn how it works →
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            🔒 Secure Payments via Razorpay
          </span>
          <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
          <span className="flex items-center gap-1">
            💬 Private In-App Chat
          </span>
          <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
          <span className="flex items-center gap-1">
            ⭐ Verified by Developers
          </span>
        </div>
      </div>
    </section>
  );
}