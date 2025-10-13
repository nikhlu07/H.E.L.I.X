export function Header() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300" id="header">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center">
                <img src="/logo.svg" alt="Helix Logo" className="h-8 w-auto" />
              </div>
              <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                <a href="#problem" className="text-gray-500 hover:text-yellow-600 transition-colors duration-300">The Problem</a>
                <a href="#solution" className="text-gray-500 hover:text-yellow-600 transition-colors duration-300">Our Solution</a>
                <a href="#howitworks" className="text-gray-500 hover:text-yellow-600 transition-colors duration-300">How It Works</a>
                <a href="#features" className="text-gray-500 hover:text-yellow-600 transition-colors duration-300">Features</a>
              </nav>
              <div>
                <button className="hidden sm:inline-block bg-yellow-500 text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-90 transition-all duration-300">Get Started</button>
              </div>
            </div>
          </div>
        </header>
    )
}