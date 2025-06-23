import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal } from 'lucide-react';

interface MobileMenuProps {
  sections: Array<{ id: string; title: string; icon: React.ComponentType<any> }>;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  sections,
  activeSection,
  onSectionChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fechar menu quando a seção mudar
  useEffect(() => {
    setIsOpen(false);
  }, [activeSection]);

  // Prevenir scroll quando menu estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg border border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300 relative z-50"
        aria-label="Toggle menu"
      >
        <div className="relative w-6 h-6">
          <Menu 
            className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
              isOpen ? 'opacity-0 rotate-45 scale-0' : 'opacity-100 rotate-0 scale-100'
            }`} 
          />
          <X 
            className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
              isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-0'
            }`} 
          />
        </div>
      </button>

      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-md border-l border-cyan-500/30 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/30">
          <div className="flex items-center space-x-2">
            <Terminal className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold text-cyan-400">DEVIEM</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => {
                onSectionChange(section.id);
                setIsOpen(false); // Fechar menu ao clicar em um item
              }}
              className={`w-full flex items-center space-x-3 px-4 py-4 rounded-lg transition-all duration-300 text-left ${
                activeSection === section.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400 shadow-cyan-glow'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50'
              }`}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: isOpen ? 'slideInRight 0.3s ease-out forwards' : 'none'
              }}
            >
              <section.icon className="w-5 h-5" />
              <span className="font-medium">{section.title}</span>
            </button>
          ))}
        </nav>

        {/* Decorative elements */}
        <div className="absolute top-20 right-4 w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-8 w-1 h-1 bg-purple-400/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 right-6 w-1.5 h-1.5 bg-green-400/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .shadow-cyan-glow {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
          }
        `
      }} />
    </>
  );
};

export default MobileMenu;