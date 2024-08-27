import React, { ReactNode } from "react";

const GradientBackground = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-purple-200 dark:from-gray-900 dark:via-gray-900/50 dark:to-gray-800">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
      <div className="relative">{children}</div>
    </div>
  );
};

export default GradientBackground;
