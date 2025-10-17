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
              <div className="flex items-center ">
                <Link to="/docs" className="text-white hover:text-yellow-600 transition-colors duration-300">
                  <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffff"><path d="M7 18H10.5H14" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 14H7.5H8" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M7 10H8.5H10" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M7 2L16.5 2L21 6.5V19" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M3 20.5V6.5C3 5.67157 3.67157 5 4.5 5H14.2515C14.4106 5 14.5632 5.06321 14.6757 5.17574L17.8243 8.32426C17.9368 8.43679 18 8.5894 18 8.74853V20.5C18 21.3284 17.3284 22 16.5 22H4.5C3.67157 22 3 21.3284 3 20.5Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M14 5V8.4C14 8.73137 14.2686 9 14.6 9H18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </Link>
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