import React from "react";

export const MatrixLogo: React.FC<{ className?: string; iconOnly?: boolean }> = ({
  className = "",
  iconOnly = false,
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Gold Matrix IoT Circuit Icon */}
      <svg
        width="38"
        height="38"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Nodes Grid & Circuit Lines in Gold */}
        <circle cx="28" cy="28" r="16" stroke="#D4A017" strokeWidth="6" />
        <circle cx="28" cy="28" r="6" fill="#D4A017" />
        
        <circle cx="72" cy="58" r="14" stroke="#D4A017" strokeWidth="6" />
        <circle cx="72" cy="58" r="5" fill="#D4A017" />

        <circle cx="28" cy="72" r="18" stroke="#D4A017" strokeWidth="6" />
        <circle cx="28" cy="72" r="4" fill="#D4A017" />

        <circle cx="50" cy="28" r="5" fill="#D4A017" />
        <circle cx="68" cy="28" r="5" fill="#D4A017" />
        <circle cx="86" cy="28" r="5" fill="#D4A017" />

        <circle cx="50" cy="48" r="5" fill="#D4A017" />
        <circle cx="68" cy="48" r="5" fill="#D4A017" />
        <circle cx="86" cy="48" r="5" fill="#D4A017" />

        <circle cx="14" cy="48" r="5" fill="#D4A017" />
        <circle cx="50" cy="68" r="5" fill="#D4A017" />

        <path d="M44 28H86" stroke="#D4A017" strokeWidth="4" />
        <path d="M86 28V48" stroke="#D4A017" strokeWidth="4" />
        <path d="M44 86H86" stroke="#D4A017" strokeWidth="4" />
        <path d="M86 68V86" stroke="#D4A017" strokeWidth="4" />
        <path d="M14 40V56" stroke="#D4A017" strokeWidth="4" />
      </svg>

      {!iconOnly && (
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 tracking-wider text-base leading-none font-sans">
            MATRIX <span className="text-primary">IOT</span>
          </span>
          <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">
            Solutions Sdn Bhd
          </span>
        </div>
      )}
    </div>
  );
};
