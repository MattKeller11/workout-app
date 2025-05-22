import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer = ({ children, className = "" }: PageContainerProps) => (
  <div
    className={`min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 w-full ${className}`}
  >
    <div className="w-full max-w-xl flex flex-col items-center">{children}</div>
  </div>
);

export default PageContainer;
