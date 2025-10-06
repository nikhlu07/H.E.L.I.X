import React from 'react';

const Style = () => {
  return (
    <style>{`
      body {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(white, white);
          color: #1A202C;
          overflow-x: hidden;
      }
      #hero-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
      }
      .hero-content {
          position: relative;
          z-index: 2;
      }
      .card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          transition: all 0.3s ease;
      }
      .card:hover {
          border-color: #3B82F6;
          transform: translateY(-5px);
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1);
      }
      .cta-gradient {
          background: linear-gradient(90deg, #3B82F6, #2563EB);
      }
      .glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
      }
      ::selection {
          background-color: #3B82F6;
          color: white;
      }
      ::-webkit-scrollbar {
          width: 8px;
      }
      ::-webkit-scrollbar-track {
          background: #EDF2F7;
      }
      ::-webkit-scrollbar-thumb {
          background: #A0AEC0;
          border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
          background: #718096;
      }
      .hero-title-char {
          display: inline-block;
      }
      .tab-button {
          transition: all 0.3s ease;
          border-bottom: 2px solid transparent;
      }
      .tab-button.active {
          color: #2563EB;
          border-color: #2563EB;
      }
      .tab-content {
          display: none;
      }
      .tab-content.active {
          display: block;
      }
      .feature-card {
          background: #F0F5FF;
          border: 1px solid #D1E0FF;
          transition: all 0.3s ease;
      }
      .feature-card:hover {
          background: white;
          border-color: #3B82F6;
          transform: translateY(-5px);
      }
    `}</style>
  );
};

export default Style;