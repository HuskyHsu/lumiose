import { Cat, ChartPie, ChevronDown, ChevronUp, Split, Swords } from 'lucide-react';
import { useEffect, useState } from 'react';

interface QuickNavigationProps {
  hasEvolution: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const QuickNavigation = ({ hasEvolution }: QuickNavigationProps) => {
  const [activeSection, setActiveSection] = useState<string>('basic-info');
  const [isNearBottom, setIsNearBottom] = useState(false);

  const navItems: NavItem[] = [
    { id: 'basic-info', label: 'Basic Info', icon: Cat },
    { id: 'stats', label: 'Stats', icon: ChartPie },
    { id: 'moves', label: 'Moves', icon: Swords },
    ...(hasEvolution ? [{ id: 'evolution', label: 'Evolution', icon: Split }] : []),
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for any fixed headers
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if near bottom
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollY + windowHeight);
      setIsNearBottom(distanceFromBottom <= 30); // 30px threshold

      // Find which section is currently in view
      const sections = navItems.map((item) => document.getElementById(item.id));
      const viewportHeight = window.innerHeight;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= viewportHeight / 2) {
            setActiveSection(navItems[i].id);
            break;
          }
        }
      }
    };

    // Set initial active section
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  return (
    <div
      className={`fixed ${
        isNearBottom ? 'bottom-36 md:bottom-24' : 'bottom-8'
      } left-1/2 transform -translate-x-1/2 z-50 lg:hidden transition-all duration-600`}
    >
      <div className='bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-2 flex items-center space-x-1'>
        {/* Scroll to top */}
        <button
          onClick={scrollToTop}
          className='w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200'
          aria-label='Scroll to top'
        >
          <ChevronUp className='w-5 h-5 text-gray-600' />
        </button>

        {/* Section navigation */}
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
              activeSection === item.id
                ? 'bg-green-100 border-2 border-green-300 scale-110'
                : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
            }`}
            aria-label={`Scroll to ${item.label}`}
            title={item.label}
          >
            <item.icon className='w-5 h-5 text-gray-600' />
          </button>
        ))}

        {/* Scroll to bottom */}
        <button
          onClick={scrollToBottom}
          className='w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200'
          aria-label='Scroll to bottom'
        >
          <ChevronDown className='w-5 h-5 text-gray-600' />
        </button>
      </div>
    </div>
  );
};

export default QuickNavigation;
