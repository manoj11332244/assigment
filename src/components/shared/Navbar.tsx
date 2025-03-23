import React, { useState } from 'react';
import { Menu, X,} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'About Us', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];



  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      if (sidebar && !sidebar.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Main Navigation */}
      <nav className="fixed w-full top-0 z-40">
        {/* Background with gradient and blur effect */}
        <div className="absolute inset-0  bg-gradient-to-r from-voilet-400 to-voilet-200 dark:from-gray-900 dark:to-gray-800" />

        {/* Main Navbar Content */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              {/* Logo and Brand */}
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center space-x-3">
                  <div className="bg-white rounded-full p-2">
                    <span className="text-violet-600 dark:text-indigo-600 text-xl font-bold">A!</span>
                  </div>
                  <span className="text-3xl font-bold text-white">Aloha</span>
                </div>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center">
                <div className="ml-10 flex items-center space-x-6">
                  {menuItems.map((item) => (
                    <Button
                      key={item.label}
                      variant="ghost"
                      asChild
                      className="text-white/80 hover:text-white hover:bg-white/10 text-base font-medium"
                    >
                      <a href={item.href}>{item.label}</a>
                    </Button>
                  ))}

                  {/* Theme Toggle Button */}
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    {isDarkMode ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button> */}

                <Link to="/chat"> <Button className="bg-teal-400 text-violet-600 hover:bg-teal-400/90 dark:bg-teal-400 dark:text-indigo-600 font-semibold px-8">
                    Get Started
                  </Button> </Link>
                  <ThemeToggle />
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle className="mr-2" />
                {/* <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button> */}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white  z-50"
                >
                  <span className="sr-only">Open main menu</span>
                  {!isMenuOpen ? (
                    <Menu className="h-6 w-6" />
                  ) : (
                    <X className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        id="mobile-sidebar"
        className={`fixed inset-y-0 right-0 w-64 bg-gradient-to-b from-purple-600 to-purple-800 dark:from-gray-900 dark:to-gray-800 transform md:hidden transition-all duration-300 ease-in-out z-30 shadow-xl ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-20">
          <div className="flex-1 px-4 py-6 space-y-6">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                asChild
                className="w-full justify-start text-lg text-white/80 hover:text-white hover:bg-white/10 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <a href={item.href}>{item.label}</a>
              </Button>
            ))}
          </div>
          <div className="p-4 border-t border-white/10">
           <Link to="/chat"> <Button 
              className="w-full bg-teal-400 text-violet-600 hover:bg-teal-400/90 dark:text-indigo-600 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Button> </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;