import React from 'react';
import {Link} from "react-router-dom";

export function Header() {
    return (
        <header className={`top-0 left-0 w-full z-50 transition-all duration-300 bg-black`} id="header">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <img src="/logo.svg" alt="Helix Logo" className="h-8 w-auto" />
              </div>
              <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                <a href="#problem" className="text-white hover:text-yellow-600 transition-colors duration-300">The Problem</a>
                <a href="#solution" className="text-white hover:text-yellow-600 transition-colors duration-300">Our Solution</a>
                <a href="#howitworks" className="text-white hover:text-yellow-600 transition-colors duration-300">How It Works</a>
                <a href="#features" className="text-white hover:text-yellow-600 transition-colors duration-300">Features</a>
              </nav>
              <div>
                <a href="https://github.com/nikhlu07/H.E.L.I.X." className="hidden sm:inline-block text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-90 transition-all duration-300">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                     <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.03-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                   </svg>
                </a>
              </div>
            </div>
          </div>
        </header>
    )
}