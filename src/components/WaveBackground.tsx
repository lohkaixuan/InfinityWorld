import React from 'react';

const WaveBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100">
        <svg
          className="absolute bottom-0 w-full h-64 opacity-30"
          viewBox="0 0 1200 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3">
                <animate
                  attributeName="stop-opacity"
                  values="0.3;0.7;0.3"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="#1D4ED8" stopOpacity="0.5">
                <animate
                  attributeName="stop-opacity"
                  values="0.5;0.9;0.5"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.3">
                <animate
                  attributeName="stop-opacity"
                  values="0.3;0.6;0.3"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>
          <path
            fill="url(#wave-gradient)"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,213.3C960,224,1056,192,1104,176L1152,160L1152,320L1104,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;50,0;0,0"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>
          <path
            fill="url(#wave-gradient)"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,208C672,213,768,203,864,181.3C960,160,1056,128,1104,112L1152,96L1152,320L1104,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            opacity="0.6"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;-30,0;0,0"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    </div>
  );
};

export default WaveBackground;