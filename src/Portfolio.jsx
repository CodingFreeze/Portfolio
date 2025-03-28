import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { useState, useEffect, useRef, Suspense, lazy, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useTransform as useFramerTransform } from "framer-motion";
import { Sun, Moon, ArrowUp, Loader } from "lucide-react";
import { FaGithub, FaLinkedin, FaEnvelope, FaPython, FaReact, FaNodeJs, FaDatabase, FaCode, FaGit, FaMusic, FaPalette, FaBookOpen, FaHiking, FaGamepad, FaChess, FaGraduationCap, FaLaptopCode, FaUserAstronaut, FaLeaf, FaCamera, FaGlobeAmericas, FaExternalLinkAlt, FaLightbulb, FaTools, FaRocket, FaChartBar, FaBrain, FaUsers, FaSync, FaBolt, FaServer, FaCloud, FaMountain } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss } from 'react-icons/si';
import { Link } from 'react-router-dom';
import './mobileStyles.css';
import logoImage from './assets/images/logo.png'; // Import the logo image

const TiltCard = ({ children, className }) => {
  const [tiltValues, setTiltValues] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate tilt (max 5 degrees)
      const tiltX = -((e.clientY - centerY) / (rect.height / 2)) * 5;
      const tiltY = ((e.clientX - centerX) / (rect.width / 2)) * 5;
      
      setTiltValues({ x: tiltX, y: tiltY });
    }
  };

  const handleMouseLeave = () => {
    setTiltValues({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${tiltValues.x}deg) rotateY(${tiltValues.y}deg)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {children}
    </motion.div>
  );
};

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [focusedNavIndex, setFocusedNavIndex] = useState(-1);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingTheme, setLoadingTheme] = useState({
    bg: '#0A0A0A',
    text: '#FFFFFF',
    accent: '#FFFFFF',  // Changed from blue (#00B4D8) to white
    accentRgb: '255, 255, 255',  // Changed to white in RGB
    secondary: '#121212',
    muted: '#F0F0F0'  // Changed from light blue (#90E0EF) to light gray
  });
  
  // Generate background stars with useMemo - simplified
  const stars = useMemo(() => {
    return Array.from({ length: 40 }).map(() => ({  // Reduced from 65 to 40 stars
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    }));
  }, []);
  
  // Generate background galaxies
  const galaxies = useMemo(() => {
    return Array.from({ length: 5 }).map(() => ({  // Reduced from 8 to 5 galaxies
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 60 + 40,
      rotation: Math.random() * 360,
      delay: Math.random() * 4,
      // Random colors for galaxies (purples, blues, pinks for dark mode, pastels for light mode)
      color: darkMode ? [
        `rgba(${50 + Math.random() * 100}, ${20 + Math.random() * 50}, ${100 + Math.random() * 155}, 0.06)`,
        `rgba(${20 + Math.random() * 50}, ${50 + Math.random() * 100}, ${150 + Math.random() * 105}, 0.06)`,
        `rgba(${100 + Math.random() * 155}, ${20 + Math.random() * 50}, ${100 + Math.random() * 155}, 0.06)`
      ] : [
        `rgba(${180 + Math.random() * 50}, ${200 + Math.random() * 30}, ${220 + Math.random() * 30}, 0.04)`,
        `rgba(${200 + Math.random() * 40}, ${220 + Math.random() * 20}, ${230 + Math.random() * 20}, 0.04)`,
        `rgba(${210 + Math.random() * 30}, ${210 + Math.random() * 30}, ${230 + Math.random() * 20}, 0.04)`
      ],
      animationDuration: 20 + Math.random() * 60,
      spiralArms: Array.from({ length: 3 + Math.floor(Math.random() * 2) }).map((_, i) => ({  // Reduced from 3-6 to 3-5 arms
        rotation: (i * (360 / (3 + Math.floor(Math.random() * 2)))) + (Math.random() * 30 - 15),
        width: 60 + Math.random() * 70,
        height: 1 + Math.random() * 4,
        opacity: darkMode ? (0.12 + Math.random() * 0.2) : (0.08 + Math.random() * 0.12),
        curve: 0.4 + Math.random() * 0.8
      }))
    }));
  }, [darkMode]);  // Added darkMode dependency to update colors when theme changes
  
  // Loading animation effect
  useEffect(() => {
    // Set loading screen to last exactly 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    
    // Update progress percentage every 25ms
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        // Calculate progress based on time (0-100%)
        const newProgress = Math.min(100, prev + (3)); // 100% over 2.5 seconds
        return newProgress;
      });
    }, 66);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);
  
  // Remove duplicate timer
  // Add this effect to simulate loading content
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Change to 5 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  // Refs for binary/hex animation
  const introTextRef = useRef(null);
  const nameTextRef = useRef(null);
  const captionTextRef = useRef(null);
  
  // Binary/Hex Text Animation
  useEffect(() => {
    // Only run animation when loading is complete and refs are available
    if (isLoading || !introTextRef.current || !nameTextRef.current || !captionTextRef.current) return;
    
    const introText = "Abdullah";
    const nameText = "Rana";
    const captionText = "Math + CS @ UVA | Systems, Intelligence, Probability | Thinking Analysis";
    
    // Generate random chars (binary or hex)
    const generateRandomChar = () => {
      const randomType = Math.random() > 0.5 ? 'binary' : 'hex';
      if (randomType === 'binary') {
        return Math.floor(Math.random() * 2).toString();
      } else {
        const hexChars = "0123456789ABCDEF";
        return hexChars[Math.floor(Math.random() * 16)];
      }
    };
    
    // Function to generate random text of a certain length
    const generateRandomText = (length) => {
      let result = '';
      for (let i = 0; i < length; i++) {
        result += generateRandomChar();
      }
      return result;
    };
    
    // Start with random text
    introTextRef.current.textContent = generateRandomText(introText.length);
    nameTextRef.current.textContent = generateRandomText(nameText.length);
    captionTextRef.current.textContent = generateRandomText(captionText.length);
    
    // Animate intro text first, then name, then caption
    let introIndex = 0;
    let nameIndex = 0;
    let captionIndex = 0;
    let introComplete = false;
    let nameComplete = false;
    const startDelay = 1000; // Wait 1 second before starting
    
    const animationTimer = setTimeout(() => {
      // Update text at intervals
      const interval = setInterval(() => {
        // Update intro text if ref still exists
        if (!introComplete && introTextRef.current) {
          let newIntroText = '';
          for (let i = 0; i < introText.length; i++) {
            if (i <= introIndex) {
              newIntroText += introText[i];
            } else {
              newIntroText += generateRandomChar();
            }
          }
          introTextRef.current.textContent = newIntroText;
          introIndex++;
          
          if (introIndex >= introText.length) {
            introComplete = true;
            // Small delay before starting name animation
            setTimeout(() => {
              const nameInterval = setInterval(() => {
                if (nameTextRef.current) {
                  let newNameText = '';
                  for (let i = 0; i < nameText.length; i++) {
                    if (i <= nameIndex) {
                      newNameText += nameText[i];
                    } else {
                      newNameText += generateRandomChar();
                    }
                  }
                  nameTextRef.current.textContent = newNameText;
                  nameIndex++;
                  
                  if (nameIndex >= nameText.length) {
                    nameComplete = true;
                    clearInterval(nameInterval);
                    
                    // Start caption animation after name is complete
                    setTimeout(() => {
                      const captionInterval = setInterval(() => {
                        if (captionTextRef.current) {
                          let newCaptionText = '';
                          for (let i = 0; i < captionText.length; i++) {
                            if (i <= captionIndex) {
                              newCaptionText += captionText[i];
                            } else {
                              newCaptionText += generateRandomChar();
                            }
                          }
                          captionTextRef.current.textContent = newCaptionText;
                          captionIndex++;
                          
                          if (captionIndex >= captionText.length) {
                            clearInterval(captionInterval);
                          }
                        } else {
                          clearInterval(captionInterval);
                        }
                      }, 30); // Faster speed for caption due to length
                    }, 300);
                  }
                } else {
                  clearInterval(nameInterval);
                }
              }, 100);
            }, 300);
          }
        }
      }, 100);
      
      // Cleanup
      return () => {
        clearInterval(interval);
      };
    }, startDelay);
    
    return () => {
      clearTimeout(animationTimer);
    };
  }, [isLoading]); // Only rerun when loading state changes
  
  // Enhanced scroll progress tracking for smoother animation
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    smooth: 0.1  // Reduced from 0.5 for better performance
  });
  
  const portfolioRef = useRef(null);
  const navRefs = useRef([]);
  
  // For scroll animations
  const scrollRef = useRef(null);
  const { scrollYProgress: sectionScrollProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
    smooth: 0.1  // Reduced from 0.5 for better performance
  });
  
  const sectionOpacity = useTransform(
    sectionScrollProgress,
    [0, 0.2, 0.8, 1],
    [0.5, 1, 1, 0.5]
  );
  
  const sectionY = useTransform(
    sectionScrollProgress,
    [0, 0.2, 0.8, 1],
    [100, 0, 0, -100]
  );

  // Add debounced scroll handler to reduce calculations
  useEffect(() => {
    let scrollTimeout;
    
    const handleScroll = () => {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      
      scrollTimeout = window.requestAnimationFrame(() => {
        // Any scroll-dependent state updates here
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
    };
  }, []);

  const handleThemeToggle = (e) => {
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ 
      x: buttonRect.x + buttonRect.width/2, 
      y: buttonRect.y + buttonRect.height/2 
    });
    setIsAnimating(true);
    
    // Apply transition class to body before changing theme
    document.body.classList.add('theme-transition');
    
    requestAnimationFrame(() => {
      setDarkMode(!darkMode);
      
      // Remove transition class after theme change is complete
      setTimeout(() => {
        document.body.classList.remove('theme-transition');
        setIsAnimating(false);
      }, 400); // Reduced from 600ms
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // If we're in the loading screen, apply the loading theme
    if (isLoading) {
      root.style.setProperty('--bg', loadingTheme.bg);
      root.style.setProperty('--text', loadingTheme.text);
      root.style.setProperty('--accent', loadingTheme.accent);
      root.style.setProperty('--accent-rgb', loadingTheme.accentRgb);
      root.style.setProperty('--secondary', loadingTheme.secondary);
      root.style.setProperty('--muted', loadingTheme.muted);
      return;
    }
    
    // If not loading, apply the regular theme based on dark/light mode
    if (darkMode) {
      root.style.setProperty('--bg', '#000000');
      root.style.setProperty('--text', '#FFFFFF');
      root.style.setProperty('--accent', '#8B0000');
      root.style.setProperty('--accent-rgb', '139, 0, 0');
      root.style.setProperty('--secondary', '#1A1A1A');
      root.style.setProperty('--cta', '#600000');
      root.style.setProperty('--demo-btn', '#333333');
      root.style.setProperty('--divider', '#333333');
      root.style.setProperty('--muted', '#AAAAAA');
      root.style.setProperty('--card-hover', '#2A2A2A');
      root.style.setProperty('--link-hover', '#600000');
      root.style.setProperty('--intro-text', '#FFFBEA');
    } else {
      root.style.setProperty('--bg', '#FFFBEA');
      root.style.setProperty('--text', '#1A1A1A');
      root.style.setProperty('--accent', '#0066CC');
      root.style.setProperty('--accent-rgb', '0, 102, 204');
      root.style.setProperty('--secondary', '#FFF4CC');
      root.style.setProperty('--cta', '#0066CC');
      root.style.setProperty('--demo-btn', '#4D4D4D');
      root.style.setProperty('--divider', '#E0E0C0');
      root.style.setProperty('--muted', '#6C757D');
      root.style.setProperty('--intro-text', '#000000');
      root.style.setProperty('--link-hover', '#0066CC');
      root.style.setProperty('--card-hover', '#FFF0B3');
    }

    const links = document.querySelectorAll("a[href^='#']");
    links.forEach(link => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ 
            behavior: "smooth", 
            block: "start",
            inline: "nearest"
          });
        }
      });
    });
  }, [darkMode, isLoading, loadingTheme]);

  // Add CSS to fix mobile-specific issues in a separate useEffect to avoid redeclarations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 640px) {
        .group .flex-col {
          width: 100%;
        }
        
        /* Fix for project buttons on mobile */
        .group .flex-wrap {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
        }
        
        /* Make buttons more touch-friendly on mobile */
        .group a {
          display: flex;
          align-items: center;
          min-height: 36px;
          touch-action: manipulation;
        }
        
        /* Improve spacing on mobile */
        .group .gap-2 {
          gap: 0.625rem;
        }
        
        /* Fix for mobile navigation */
        .fixed.inset-0 {
          z-index: 100;
        }
      }
    `;
    
    // Remove any previous style element with the same id
    const existingStyle = document.getElementById('mobile-fixes');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Add id and append to head
    style.id = 'mobile-fixes';
    document.head.appendChild(style);
    
    // Clean up function
    return () => {
      if (document.getElementById('mobile-fixes')) {
        document.getElementById('mobile-fixes').remove();
      }
    };
  }, []);

  const projects = [
    {
      title: "AI Text Summarizer",
      description: "A web application that uses AI to generate concise summaries of long articles and documents.",
      github: "https://github.com/CodingFreeze/text-summarizer",
      demo: "https://text-summarizer-demo.vercel.app",
      techStack: ["React", "OpenAI API", "TailwindCSS", "Node.js"],
      learned: "Integrating LLM APIs, prompt engineering, and optimizing for response times."
    },
    {
      title: "Crypto Portfolio Tracker",
      description: "Monitor cryptocurrency investments in real-time with price alerts and performance analytics.",
      github: "https://github.com/CodingFreeze/crypto-tracker",
      demo: "https://crypto-tracker-app.vercel.app",
      techStack: ["Next.js", "TypeScript", "CoinGecko API", "Chart.js"],
      learned: "Real-time data visualization, API rate limiting, and secure user authentication."
    },
    {
      title: "E-Commerce Platform",
      description: "A full-featured online store with product listings, shopping cart, and payment processing.",
      github: "https://github.com/CodingFreeze/ecommerce-site",
      demo: "https://ecommerce-site-demo.vercel.app",
      techStack: ["React", "Firebase", "Stripe", "Redux"],
      learned: "State management patterns, payment gateway integration, and inventory tracking systems."
    },
    {
      title: "Social Media Dashboard",
      description: "An analytics dashboard for tracking engagement and analytics across multiple social media platforms.",
      github: "https://github.com/CodingFreeze/social-dashboard",
      demo: "https://social-dashboard-demo.vercel.app",
      techStack: ["Vue.js", "D3.js", "Express", "MongoDB"]
    }
  ];

  const skills = [
    { 
      name: "React", 
      icon: <FaReact className="w-6 h-6" />,
      description: "Frontend development",
      categories: []
    },
    { 
      name: "JavaScript", 
      icon: <FaCode className="w-6 h-6" />,
      description: "Web development",
      categories: []
    },
    { 
      name: "Python", 
      icon: <FaPython className="w-6 h-6" />,
      description: "Backend & data science",
      categories: []
    },
    { 
      name: "Node.js", 
      icon: <FaNodeJs className="w-6 h-6" />,
      description: "Server-side applications",
      categories: []
    },
    { 
      name: "SQL", 
      icon: <FaDatabase className="w-6 h-6" />,
      description: "Database management",
      categories: []
    },
    { 
      name: "Git", 
      icon: <FaGit className="w-6 h-6" />,
      description: "Version control",
      categories: []
    },
    { 
      name: "Docker", 
      icon: <FaCode className="w-6 h-6" />,
      description: "Containerization",
      categories: []
    },
    { 
      name: "Machine Learning", 
      icon: <FaCode className="w-6 h-6" />,
      description: "AI & data modeling",
      categories: []
    },
    { 
      name: "TypeScript", 
      icon: <SiTypescript className="w-6 h-6" />,
      description: "Type-safe JavaScript",
      categories: []
    },
    { 
      name: "TailwindCSS", 
      icon: <SiTailwindcss className="w-6 h-6" />,
      description: "Utility-first CSS",
      categories: []
    }
  ];

  const experiences = [
    {
      title: "Software Engineering Intern",
      company: "[Company Name]",
      period: "Summer 2024",
      description: "Description of your internship and key achievements."
    },
    {
      title: "Data Science Intern",
      company: "[Company Name]",
      period: "Summer 2023",
      description: "Description of your data science internship role."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Add keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Close project modal if open
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
      
      // Handle tab navigation in the header
      if (e.key === 'Tab' && !e.shiftKey && focusedNavIndex >= 0) {
        e.preventDefault();
        const nextIndex = (focusedNavIndex + 1) % navRefs.current.length;
        navRefs.current[nextIndex]?.focus();
        setFocusedNavIndex(nextIndex);
      } else if (e.key === 'Tab' && e.shiftKey && focusedNavIndex >= 0) {
        e.preventDefault();
        const prevIndex = (focusedNavIndex - 1 + navRefs.current.length) % navRefs.current.length;
        navRefs.current[prevIndex]?.focus();
        setFocusedNavIndex(prevIndex);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject, focusedNavIndex, navRefs]);

  const xPosition = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  const [mode, setMode] = useState('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [activeTab, setActiveTab] = useState('technical');
  const [activeCourseTab, setActiveCourseTab] = useState('completed');

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        {/* Matrix-style code rain effect */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(80)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-[var(--accent)] font-mono"
              initial={{ 
                opacity: 0.7,
                x: `${Math.random() * 100}%`, 
                y: -50,
                fontSize: `${Math.random() * 12 + 10}px`
              }}
              animate={{
                y: ['0%', '100%'],
                opacity: [0.7, 0.2]
              }}
              transition={{
                duration: 2 + Math.random() * 4,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                delay: Math.random() * 2
              }}
            >
              {Math.random() > 0.5 ? 
                "416264756C6C6168"[Math.floor(Math.random() * 16)] :
                "52616E61"[Math.floor(Math.random() * 8)]}
            </motion.div>
          ))}
        </div>

        {/* Centered logo animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mb-12"
        >
          <div className="relative">
            <motion.div 
              className="w-28 h-28 rounded-full border-4 border-[var(--accent)] relative flex items-center justify-center overflow-hidden"
              initial={{ boxShadow: "0 0 0 0 rgba(var(--accent-rgb), 0.7)" }}
              animate={{ 
                boxShadow: ["0 0 0 0 rgba(var(--accent-rgb), 0.7)", "0 0 0 20px rgba(var(--accent-rgb), 0)", "0 0 0 0 rgba(var(--accent-rgb), 0)"]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              {/* Water filling animation */}
              <motion.div
                className="absolute w-full bottom-0 rounded-b-full"
                style={{
                  background: "linear-gradient(to bottom, rgba(var(--accent-rgb), 0.7), rgba(var(--accent-rgb), 0.4))",
                  filter: "brightness(1.2) saturate(1.5)",
                  transformOrigin: "bottom"
                }}
                initial={{ height: "0%" }}
                animate={{ height: "100%" }}
                transition={{ 
                  duration: 2,
                  ease: [0.45, 0.05, 0.55, 0.95],
                  repeat: 0
                }}
              >
                {/* Wave effect on top of water */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-4 overflow-hidden"
                  style={{
                    transform: "translateY(-50%)"
                  }}
                >
                  <motion.div
                    className="h-4 w-[200%]"
                    style={{
                      backgroundImage: "radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)",
                }}
                animate={{ 
                      x: ["-50%", "0%", "-50%"]
                }}
                transition={{ 
                      duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </motion.div>
              
              {/* Bubbles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`bubble-${i}`}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: 2 + (i % 3) * 2 + 'px',
                    height: 2 + (i % 3) * 2 + 'px',
                    left: 10 + i * 12 + (Math.random() * 5) + 'px',
                    opacity: 0.6
                  }}
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ 
                    y: -5 - (i * 3),
                    opacity: [0, 0.7, 0]
                  }}
                  transition={{
                    duration: 1.5 + (i * 0.3),
                    repeat: Infinity,
                    repeatDelay: i * 0.2,
                    ease: "easeOut",
                    delay: i * 0.4
                  }}
                />
              ))}
              
              <motion.div 
                className="text-3xl font-bold text-white z-10"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {Math.round(loadingProgress)}%
              </motion.div>
            </motion.div>
            
            {/* Droplets falling into the container */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                key={`droplet-${i}`}
                className="absolute w-3 h-3 rounded-full bg-[var(--accent)]"
                  style={{
                  filter: "brightness(1.1)",
                  left: 'calc(50% - 1.5px)',
                  top: `-${20 + i * 10}px`,
                  opacity: 0.8
                  }}
                  animate={{
                  top: ["0%", "50%"],
                  opacity: [0.8, 0],
                  scale: [1, 0.4]
                  }}
                  transition={{
                  duration: 0.6,
                    repeat: Infinity,
                  repeatDelay: 1 + i * 0.7,
                  ease: "easeIn",
                  delay: i * 0.7
                }}
              />
            ))}
          </div>
        </motion.div>
        
        <motion.h2 
          className="text-2xl font-semibold mb-4 relative bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(90deg, var(--text) 0%, var(--accent) 50%, var(--text) 100%)",
            backgroundSize: "200% auto"
          }}
          initial={{ backgroundPosition: "0% center" }}
          animate={{ backgroundPosition: ["0% center", "200% center"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Loading Portfolio
        </motion.h2>
        
        <motion.div
          className="flex items-center gap-3 text-[var(--muted)]"
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent w-full"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      ref={portfolioRef}
      className="flex flex-col min-h-screen" 
      data-theme={darkMode ? "dark" : "light"}
                  style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        position: 'relative',
        scrollBehavior: 'smooth',
                  }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
                >
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-700 bg-opacity-20 z-[9999]">
                  <motion.div
          className="h-full bg-[var(--accent)]"
                    style={{
            scaleX: scrollYProgress,
            transformOrigin: "left"
          }}
        />
      </div>

      {/* Simple Static Stars Background */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {stars.map((star, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full will-change-transform"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(100, 120, 140, 0.3)",
              marginBottom: "3rem",
              boxShadow: darkMode ? "0 0 4px 2px rgba(255, 255, 255, 0.6)" : "0 0 3px 1px rgba(100, 120, 140, 0.2)",
              transform: `translateZ(0)`,  // Force GPU acceleration
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: star.delay }}
          />
        ))}

        {/* Galaxy/Nebula Background Elements */}
        {galaxies.map((galaxy, index) => (
          <motion.div
            key={`galaxy-${index}`}
            className="absolute rounded-full overflow-hidden will-change-transform"
            style={{
              left: `${galaxy.left}%`,
              top: `${galaxy.top}%`,
              width: `${galaxy.size}px`,
              height: `${galaxy.size}px`,
              transform: `rotate(${galaxy.rotation}deg) translateZ(0)`,  // Force GPU acceleration
              zIndex: 5,
              pointerEvents: "none"
            }}
            initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [0.8, 1, 0.8],
              rotate: [`${galaxy.rotation}deg`, `${galaxy.rotation + 360}deg`]
                    }}
                    transition={{
              duration: galaxy.animationDuration,
                      repeat: Infinity,
              ease: "linear",
              delay: galaxy.delay
            }}
          >
            {/* Multiple gradient layers create nebula effect */}
            {galaxy.color.map((color, colorIndex) => (
              <motion.div
                key={`galaxy-${index}-layer-${colorIndex}`}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                  mixBlendMode: darkMode ? "screen" : "multiply",
                  transform: `rotate(${colorIndex * 45}deg)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [`${colorIndex * 45}deg`, `${colorIndex * 45 + 180}deg`, `${colorIndex * 45 + 360}deg`],
                }}
                transition={{
                  duration: galaxy.animationDuration / 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: colorIndex * 2
                }}
              />
            ))}
            
            {/* Galaxy core - bright center */}
                  <motion.div
              className="absolute rounded-full"
                    style={{
                width: '20%',
                height: '20%',
                background: `radial-gradient(circle, ${galaxy.color[0].replace('0.1', '0.3')} 0%, transparent 100%)`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                filter: 'blur(2px)',
                mixBlendMode: darkMode ? "screen" : "soft-light",
                    }}
                    animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 0.9, 0.7],
                    }}
                    transition={{
                duration: galaxy.animationDuration / 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Spiral arms for galaxy effect */}
            {galaxy.spiralArms.map((arm, armIndex) => (
              <motion.div
                key={`galaxy-${index}-arm-${armIndex}`}
                className="absolute"
                style={{
                  width: `${arm.width}%`,
                  height: `${arm.height}px`,
                  background: `linear-gradient(90deg, transparent, ${galaxy.color[armIndex % galaxy.color.length].replace('0.1', arm.opacity)}, transparent)`,
                  left: '50%',
                  top: '50%',
                  transformOrigin: 'left center',
                  transform: `translate(-50%, -50%) rotate(${arm.rotation}deg) scaleX(${1 + arm.curve}) ${arm.curve > 0.7 ? 'skewY(5deg)' : ''}`,
                  borderRadius: '100%',
                  filter: 'blur(1.5px)'
                }}
                animate={{
                  rotate: [`${arm.rotation}deg`, `${arm.rotation + 360}deg`],
                  width: [`${arm.width}%`, `${arm.width * (0.8 + arm.curve * 0.2)}%`, `${arm.width}%`],
                  scaleX: [1 + arm.curve, 1 + arm.curve * 1.2, 1 + arm.curve],
                  skewY: arm.curve > 0.7 ? ['3deg', '7deg', '3deg'] : ['0deg', '0deg', '0deg']
                }}
                transition={{
                  duration: galaxy.animationDuration * (0.7 + arm.curve * 0.3),
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
            ))}
                </motion.div>
        ))}
                
        {/* Add dust particles for additional flowing effect */}
        {galaxies.map((galaxy, index) => (
          [...Array(5)].map((_, i) => (
                <motion.div
              key={`dust-${index}-${i}`}
              className="absolute rounded-full"
                  style={{
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                backgroundColor: darkMode 
                  ? galaxy.color[i % galaxy.color.length].replace('0.1', '0.25')
                  : `rgba(${180 + Math.random() * 50}, ${200 + Math.random() * 30}, ${220 + Math.random() * 30}, 0.15)`,
                filter: 'blur(1px)',
                left: `${galaxy.left + (Math.random() * galaxy.size / 2) - galaxy.size / 4}%`,
                top: `${galaxy.top + (Math.random() * galaxy.size / 2) - galaxy.size / 4}%`,
                boxShadow: darkMode 
                  ? `0 0 2px 1px ${galaxy.color[i % galaxy.color.length].replace('0.1', '0.15')}`
                  : `0 0 2px 1px rgba(180, 200, 220, 0.1)`,
                zIndex: 4
                  }}
                  animate={{
                x: [
                  Math.random() * 30 - 15, 
                  Math.random() * 60 - 30, 
                  Math.random() * 30 - 15
                ],
                y: [
                  Math.random() * 30 - 15, 
                  Math.random() * 60 - 30, 
                  Math.random() * 30 - 15
                ],
                opacity: darkMode ? [0.4, 0.7, 0.4] : [0.2, 0.4, 0.2],
                scale: [1, 1.3, 1]
                  }}
                  transition={{
                duration: galaxy.animationDuration * 0.6,
                    repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5 + Math.random() * 2
                  }}
                />
          ))
        ))}
      </div>
                
      {isAnimating && (
                <motion.div
          className="fixed inset-0 z-40 pointer-events-none"
          initial={{ clipPath: `circle(0px at ${mousePosition.x}px ${mousePosition.y}px)` }}
          animate={{ clipPath: `circle(200% at ${mousePosition.x}px ${mousePosition.y}px)` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  style={{
            background: darkMode ? '#FFFBEA' : '#000000',
          }}
        />
      )}

      <motion.header
        className="relative flex justify-between items-center gap-2 sm:gap-4 py-4 w-full"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          backgroundColor: 'var(--bg)'
        }}
      >
        {/* Mobile Menu Toggle Button - Only visible on mobile */}
        <button 
          className="lg:hidden z-50 p-1.5 ml-4 text-[var(--text)] hover:text-[var(--accent)] transition-colors" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden lg:flex gap-3 sm:gap-6 text-sm sm:text-base lg:text-lg font-semibold pl-6 sm:pl-8 md:pl-12 lg:pl-16">
          <a 
            href="#about" 
            className="hover:text-[var(--link-hover)] transition-all duration-300 hover:scale-105"
            ref={navRefs.current[0]}
          >
            About Me
          </a>
          <a 
            href="#projects" 
            className="hover:text-[var(--link-hover)] transition-all duration-300 hover:scale-105"
            ref={navRefs.current[1]}
          >
            Projects
          </a>
          <a 
            href="#experience" 
            className="hover:text-[var(--link-hover)] transition-all duration-300 hover:scale-105"
            ref={navRefs.current[2]}
          >
            Experience
          </a>
          <a 
            href="#skills" 
            className="hover:text-[var(--link-hover)] transition-all duration-300 hover:scale-105"
            ref={navRefs.current[3]}
          >
            Skills
          </a>
        </div>

        <div 
          className="absolute left-1/2 -translate-x-1/2 text-xl sm:text-2xl font-bold text-[#68A1B1] hover:scale-110 transition-transform duration-300 cursor-pointer z-50"
          aria-label="Abdullah Rana logo"
        >
          <a 
            href="#top" 
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Go to homepage"
          >
            <img 
              src={logoImage} 
              alt="Abdullah Rana Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full"
            />
          </a>
        </div>

        {/* Desktop Right Navigation - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-3 sm:gap-6 text-sm sm:text-base lg:text-lg font-semibold pr-6 sm:pr-8 md:pr-12 lg:pr-16">
          <a 
            href="#current-projects" 
            className="hover:text-[var(--link-hover)] transition-all duration-300 hover:scale-105"
            ref={navRefs.current[4]}
          >
            In Progress
          </a>
          <a 
            href="#coursework" 
            className="hover:text-[var(--link-hover)] transition-all duration-300 hover:scale-105"
            ref={navRefs.current[5]}
          >
            Coursework
          </a>
          <a 
            href="#passions" 
            className="hover:text-[var(--link-hover)] transition-all duration-300 hover:scale-105"
            ref={navRefs.current[6]}
          >
            Passions
          </a>
          <div className="z-50">
            <button
              onClick={handleThemeToggle}
              className="rounded-full p-1.5 sm:p-2 hover:bg-[var(--accent)] hover:text-white transition-all duration-300 hover:scale-105"
              disabled={isAnimating}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="w-5 h-5 sm:w-6 sm:h-6" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Theme Toggle - Only visible on mobile */}
        <div className="lg:hidden flex items-center mr-4 z-50">
          <button
            onClick={handleThemeToggle}
            className="rounded-full p-1.5 sm:p-2 hover:bg-[var(--accent)] hover:text-white transition-all duration-300 hover:scale-105"
            disabled={isAnimating}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="w-5 h-5 sm:w-6 sm:h-6" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu - Full Screen Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-[var(--bg)] z-40 flex items-center justify-center lg:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center gap-6 text-xl">
                {/* Add clickable [AR] logo in mobile menu */}
                <div className="mb-6 text-3xl font-bold text-[#68A1B1]">
                  <a 
                    href="#top" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setIsMenuOpen(false);
                    }}
                    aria-label="Go to homepage"
                  >
                    <img 
                      src={logoImage} 
                      alt="Abdullah Rana Logo" 
                      className="w-16 h-16 rounded-full"
                    />
                  </a>
                </div>
                
                <a 
                  href="#about" 
                  className="hover:text-[var(--link-hover)] transition-all duration-300 hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Me
                </a>
                <a 
                  href="#projects" 
                  className="hover:text-[var(--link-hover)] transition-all duration-300 hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Projects
                </a>
                <a 
                  href="#experience" 
                  className="hover:text-[var(--link-hover)] transition-all duration-300 hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Experience
                </a>
                <a 
                  href="#skills" 
                  className="hover:text-[var(--link-hover)] transition-all duration-300 hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Skills
                </a>
                <a 
                  href="#current-projects" 
                  className="hover:text-[var(--link-hover)] transition-all duration-300 hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                >
                  In Progress
                </a>
                <a 
                  href="#coursework" 
                  className="hover:text-[var(--link-hover)] transition-all duration-300 hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Coursework
                </a>
                <a 
                  href="#passions" 
                  className="hover:text-[var(--link-hover)] transition-all duration-300 hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Passions
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <div className="min-h-screen flex items-center justify-center z-50 relative px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="text-center px-2 sm:px-4 relative max-w-full">
          {/* Animated background elements */}
          <motion.div
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Decorative circles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 15 + 8}px`,
                  height: `${Math.random() * 15 + 8}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `rgba(var(--accent-rgb), ${Math.random() * 0.25 + 0.15})`,
                  }}
                  animate={{
                  scale: [1, 1.3, 1],
                  x: [
                    Math.random() * 20 - 10,
                    Math.random() * 40 - 20,
                    Math.random() * 20 - 10
                  ],
                  y: [
                    Math.random() * 20 - 10,
                    Math.random() * 40 - 20,
                    Math.random() * 20 - 10
                  ],
                  rotate: [0, 180, 360],
                  }}
                  transition={{
                  duration: 6 + Math.random() * 4,
                    repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                  }}
                />
            ))}
                
            {/* Glowing circle behind name */}
                  <motion.div
              className="absolute rounded-full bg-[var(--accent)] blur-[40px] opacity-25"
                    style={{
                width: "160px",
                height: "160px",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                    }}
                    animate={{
                opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{
                duration: 4,
                      repeat: Infinity,
                ease: "easeInOut",
                    }}
                  />
              </motion.div>
              
          {/* Animated text reveal */}
          <motion.h1 
            className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] font-bold mb-0 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <motion.span 
              className="text-[var(--accent)] inline-block"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              ref={introTextRef}
            >
              Abdullah
            </motion.span>
            {" "}
            <motion.span 
              className="text-[var(--text)] inline-block relative"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              ref={nameTextRef}
            >
              Rana
            </motion.span>
          </motion.h1>
          <div className="flex flex-col gap-0 -mt-2 sm:-mt-3">
            <motion.p 
              className="text-sm sm:text-base md:text-lg text-[var(--muted)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              ref={captionTextRef}
            >
              Math + CS @ UVA | Systems, Intelligence, Probability | Thinking Analysis 
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
        <motion.section 
          id="about" 
          className="min-h-[50vh] py-6 sm:py-10 relative" 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          ref={scrollRef}
          style={{
            opacity: sectionOpacity,
            background: darkMode 
              ? "linear-gradient(135deg, rgba(20,20,22,0.7) 0%, rgba(35,35,40,0.5) 50%, rgba(20,20,22,0.7) 100%)" 
              : "linear-gradient(135deg, rgba(230,230,235,0.7) 0%, rgba(240,240,245,0.5) 50%, rgba(230,230,235,0.7) 100%)",
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "2rem",
              boxShadow: darkMode
              ? "inset 0 0 30px rgba(0,0,0,0.3)"
              : "inset 0 0 30px rgba(0,0,0,0.05)"
          }}
        >
                <motion.div
            className="flex flex-col gap-6 sm:gap-8"
                  style={{
              position: "relative",
              zIndex: 1
            }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl font-semibold mb-4 sm:mb-8 relative z-10"
              animate={{ y: 0 }}
              initial={{ y: 20 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                delay: 0.2 
              }}
              style={{
                background: "linear-gradient(90deg, var(--accent), #3498db, var(--accent))",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "var(--gradient-animation)"
              }}
            >
              About Me
            </motion.h2>
            
            {/* Parallax Background Elements */}
            <motion.div 
              className="absolute -right-20 -top-10 w-32 h-32 rounded-full opacity-5 z-0"
              style={{ 
                background: "var(--accent)",
                filter: "blur(15px)" 
              }}
                  animate={{ 
                opacity: [0.03, 0.05, 0.03],
                  }}
                  transition={{
                      repeat: Infinity,
                duration: 8,
                ease: "easeInOut" 
              }}
            />
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10">
              <div className="flex-1">
                <p className="text-base sm:text-lg leading-relaxed text-[var(--muted)]">
            I'm a Computer Science and Mathematics student at the University of Virginia, passionate about software engineering, fintech, and AI. I enjoy building impactful tech and continuously learning new things.
          </p>
              </div>
              
              <div className="hidden md:block w-[1px] h-32 bg-[var(--divider)]"></div>
              
              <div className="flex-1 flex flex-col gap-4 text-sm sm:text-base">
                <a 
                  href="https://github.com/CodingFreeze" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-[var(--accent)] transition-colors"
                >
                  <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">github.com/CodingFreeze</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/abdullahranaofc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-[var(--accent)] transition-colors"
                >
                  <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">linkedin.com/in/abdullahranaofc</span>
                </a>
                <a 
                  href="mailto:abdullahranaofc@gmail.com"
                  className="flex items-center gap-3 hover:text-[var(--accent)] transition-colors"
                >
                  <FaEnvelope className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">abdullahranaofc@gmail.com</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Section Divider */}
          <div className="relative h-24 my-4 overflow-hidden">
            <motion.svg 
              className="absolute w-full" 
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none"
              initial={{ y: 20, opacity: 0.8 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <motion.path 
                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
                fill="var(--accent)"
                fillOpacity="0.25"
                animate={{
                  y: [0, -5, 0],
                  fillOpacity: [0.25, 0.35, 0.25]
                }}
                transition={{
                  duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                }}
              />
            </motion.svg>
            
            {/* Removed floating particles that might appear as red dots */}
        </div>
      </motion.section>

        <motion.section 
          id="projects" 
          className="min-h-[50vh] py-10 relative"
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            background: darkMode 
              ? "linear-gradient(135deg, rgba(20,20,22,0.7) 50%, rgba(35,35,40,0.5) 90%, rgba(20,20,22,0.7) 100%)" 
              : "linear-gradient(135deg, rgba(230,230,235,0.7) 50%, rgba(240,240,245,0.5) 90%, rgba(230,230,235,0.7) 100%)",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "3rem",
              boxShadow: darkMode
              ? "inset 0 0 30px rgba(0,0,0,0.3)"
              : "inset 0 0 30px rgba(0,0,0,0.05)",
            marginBottom: "2rem"
          }}
        >
          {/* Background decoration elements */}
          <div className="absolute top-20 right-0 w-32 h-32 rounded-full opacity-5 z-0 will-change-transform" 
            style={{ 
              background: "var(--accent)",
              filter: "blur(15px)",
              transform: "translateZ(0)"  // Force GPU acceleration
            }} 
          />
          <div className="absolute bottom-20 left-0 w-24 h-24 rounded-full opacity-5 z-0 will-change-transform" 
            style={{ 
              background: "var(--accent)",
              filter: "blur(15px)",
              transform: "translateZ(0)"  // Force GPU acceleration
            }} 
          />
          
          <div className="mb-10 relative">
            <motion.h2 
              className="text-4xl font-semibold relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background: "linear-gradient(90deg, var(--accent), #3498db, var(--accent))",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "var(--gradient-animation)"
              }}
            >
              <a 
              href="https://github.com/CodingFreeze" 
            >
              Projects
            </a>
            </motion.h2>
            <motion.p 
              className="text-[var(--muted)] mt-2 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              A showcase of my technical work, side projects and applications
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        duration: 0.6,
                        delay: index * 0.1 // Reduced from 0.2
                      }
                    }
                  }}
                  className="group h-auto transform transition-transform duration-300 hover:scale-102 hover:-translate-y-1"
                >
                  <div 
                    className="h-full overflow-hidden relative rounded-lg border border-[var(--accent)] border-opacity-20 shadow-sm hover:shadow-lg bg-[var(--secondary)] transition-all duration-300"
                  >
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-[var(--accent)] opacity-5 z-0"></div>
                    
                    <div className="p-4 sm:p-6 flex flex-col h-full relative z-10">
                      {/* Project icon - New element */}
                      <div className="absolute right-4 top-4 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--accent)]">
                        <FaLaptopCode className="w-5 h-5 text-white" />
                      </div>
                      
                      {/* Title at the top */}
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-[var(--accent)] transition-colors pr-12">{project.title}</h3>
                      
                      {/* Description below title */}
                      <p className="text-[var(--muted)] mb-4 text-sm sm:text-base">{project.description}</p>
                      
                      {/* What I Learned Section with enhanced styling */}
                      <div className="p-3 rounded-md bg-[var(--bg)] bg-opacity-50 mt-auto mb-4 border-l-2 border-[var(--accent)] border-opacity-40">
                        <h4 className="text-sm font-medium mb-1 text-[var(--accent)]">What I Learned</h4>
                        <p className="text-[var(--muted)] text-xs sm:text-sm">{project.learned || "Various skills and technologies related to this project."}</p>
                      </div>
                      
                      {/* Bottom section with improved responsive layout */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-auto w-full">
                        {/* Left: GitHub and Live Demo buttons side by side */}
                        <div className="inline-flex flex-nowrap gap-2 w-auto project-buttons">
                          <Button 
                            className="flex items-center gap-2 bg-transparent hover:bg-[var(--accent)] hover:text-white transition-colors text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 border border-[var(--accent)] text-[var(--accent)] min-h-[36px] rounded-r-none"
                            asChild
                          >
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap">
                              <FaGithub className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>GitHub</span>
                            </a>
                          </Button>
                          <Button 
                            className="flex items-center gap-2 bg-[var(--accent)] hover:opacity-90 transition-opacity px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-white min-h-[36px] rounded-l-none border-l-0"
                            asChild
                          >
                            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap">
                              <FaExternalLinkAlt className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white flex-shrink-0" />
                              <span>Live Demo</span>
                            </a>
                          </Button>
                        </div>
                        
                        {/* Right: Tech stack boxes with enhanced styling */}
                        <div className="flex flex-wrap gap-1 sm:gap-2 justify-start sm:justify-end w-full sm:w-auto project-tech-stack">
                          {project.techStack && project.techStack.map((tech, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-1 text-xs rounded-full transition-colors duration-200 bg-[var(--bg)] hover:bg-[var(--accent)] hover:text-white whitespace-nowrap"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Projects Summary - New element */}
              <motion.div 
            className="mt-12 bg-[var(--secondary)] p-6 rounded-lg shadow-md border border-[var(--accent)] border-opacity-20 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] via-blue-500 to-transparent opacity-5 z-0"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--accent)]">
                  <FaCode className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-medium">Project Highlights</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
                <div className="bg-[var(--bg)] p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Focus Areas</h4>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--accent)]">
                      <FaLightbulb className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <ul className="text-sm text-[var(--muted)] space-y-2">
                    <li className="flex items-center gap-2">
                      <FaLaptopCode className="w-3.5 h-3.5 text-white" />
                      <span>Full-stack web development</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaChartBar className="w-3.5 h-3.5 text-white" />
                      <span>Data visualization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaBrain className="w-3.5 h-3.5 text-white" />
                      <span>Machine learning applications</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[var(--bg)] p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Technologies</h4>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--accent)]">
                      <FaTools className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <ul className="text-sm text-[var(--muted)] space-y-2">
                    <li className="flex items-center gap-2">
                      <FaReact className="w-3.5 h-3.5 text-white" />
                      <span>Modern JavaScript frameworks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaServer className="w-3.5 h-3.5 text-white" />
                      <span>RESTful & GraphQL APIs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCloud className="w-3.5 h-3.5 text-white" />
                      <span>Cloud deployment</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[var(--bg)] p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Approach</h4>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--accent)]">
                      <FaRocket className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <ul className="text-sm text-[var(--muted)] space-y-2">
                    <li className="flex items-center gap-2">
                      <FaUsers className="w-3.5 h-3.5 text-white" />
                      <span>User-centered design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaSync className="w-3.5 h-3.5 text-white" />
                      <span>Iterative development</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaBolt className="w-3.5 h-3.5 text-white" />
                      <span>Performance optimization</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <motion.a 
                  href="https://github.com/CodingFreeze" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-transparent hover:bg-[var(--accent)] hover:text-white transition-colors text-sm px-4 py-2 border border-[var(--accent)] text-[var(--accent)]"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGithub className="w-4 h-4" />
                  View All Projects
                </motion.a>
                
                <motion.a 
                  href="#contact" 
                  className="flex items-center gap-2 bg-[var(--accent)] text-white hover:opacity-90 transition-opacity text-sm px-4 py-2 rounded-md"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEnvelope className="w-4 h-4 text-white" />
                  Discuss a Project
                </motion.a>
              </div>
            </div>
              </motion.div>
        </motion.section>

        {/* Section Divider */}
        <div className="relative h-50 my-0 overflow-hidden w-full">
          <motion.svg 
            className="absolute w-full" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
            initial={{ scale: 1, y: 20, opacity: 0.8 }}
            whileInView={{ scale: 1, y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <defs>
              <linearGradient id="mountain-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.2 }}>
                  <animate 
                    attributeName="offset" 
                    values="0%;25%;0%" 
                    dur="15s" 
                    repeatCount="indefinite" 
                  />
                </stop>
                <stop offset="50%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.5 }}>
                  <animate 
                    attributeName="offset" 
                    values="50%;75%;50%" 
                    dur="15s" 
                    repeatCount="indefinite" 
                  />
                </stop>
                <stop offset="100%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.2 }}>
                  <animate 
                    attributeName="offset" 
                    values="100%;125%;100%" 
                    dur="15s" 
                    repeatCount="indefinite" 
                  />
                </stop>
              </linearGradient>
            </defs>
            <motion.path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.26-16.72,168.06-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              fill="url(#mountain-gradient)"
              strokeWidth="2"
              stroke="var(--accent)"
              strokeOpacity="0.3"
              animate={{
                y: [0, -5, 0],
                pathLength: [0.9, 1, 0.9],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.svg>
          
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (  // Reduced from 12 to 6 particles
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent)] will-change-transform"
                initial={{ 
                  x: Math.random() * 1200, 
                  y: Math.random() * 120,
                  opacity: 0.2 + Math.random() * 0.3,
                  transform: "translateZ(0)"  // Force GPU acceleration
                }}
                animate={{
                  y: [Math.random() * 120, Math.random() * 120 - 40, Math.random() * 120],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </div>
        </div>

        <motion.section 
          id="experience" 
          className="min-h-[50vh] py-10 relative"
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            background: darkMode 
              ? "linear-gradient(135deg, rgba(20,20,22,0.7) 0%, rgba(35,35,40,0.5) 50%, rgba(20,20,22,0.7) 100%)" 
              : "linear-gradient(135deg, rgba(230,230,235,0.7) 0%, rgba(240,240,245,0.5) 50%, rgba(230,230,235,0.7) 100%)",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "3rem",
              boxShadow: darkMode
              ? "inset 0 0 30px rgba(0,0,0,0.3)"
              : "inset 0 0 30px rgba(0,0,0,0.05)",
            marginBottom: "2rem"
          }}
        >
          {/* Background decoration elements */}
          <div className="absolute top-20 left-0 w-64 h-64 rounded-full opacity-10 z-0 will-change-transform" 
            style={{ 
              background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
              filter: "blur(40px)",
              transform: "translateZ(0)"  // Force GPU acceleration
            }} 
          />
          <div className="absolute bottom-20 right-0 w-40 h-40 rounded-full opacity-10 z-0 will-change-transform" 
            style={{ 
              background: "radial-gradient(circle, #3498db 0%, transparent 70%)",
              filter: "blur(30px)",
              transform: "translateZ(0)"  // Force GPU acceleration
            }} 
          />
          
          <div className="mb-10 relative">
            <motion.h2 
              className="text-4xl font-semibold relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background: "linear-gradient(90deg, var(--accent), #3498db, var(--accent))",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "var(--gradient-animation)"
              }}
            >
              Professional Experience
            </motion.h2>
            <motion.div 
              className="absolute -bottom-3 left-0 h-1 bg-gradient-to-r from-[var(--accent)] via-blue-500 to-transparent w-32"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 128, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.p 
              className="text-[var(--muted)] mt-2 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              My professional journey and roles in the tech industry
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimatePresence>
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="h-auto"
                >
                  <div 
                    className="relative overflow-hidden h-full rounded-lg border border-[var(--accent)] border-opacity-20 shadow-sm hover:shadow-lg bg-[var(--secondary)] transition-all duration-300"
                  >
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-[var(--accent)] opacity-5 z-0"></div>
                    
                    {/* Timeline dot and line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--accent)] to-blue-500 opacity-30"></div>
                    <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-gradient-to-r from-[var(--accent)] to-blue-500 transform -translate-x-1/2 z-10"></div>
                    
                    <div className="p-6 pl-12 flex flex-col h-full relative z-10">
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                          <h3 className="text-xl font-semibold">{exp.title}</h3>
                          <span className="px-3 py-1 text-xs rounded-full bg-[var(--accent)] bg-opacity-10 text-white">
                            {exp.period}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                          <p className="text-[var(--accent)] font-medium">{exp.company}</p>
                        </div>
                        <p className="text-[var(--muted)]">{exp.description}</p>
                      </div>
                      
                      <div className="flex gap-2 mt-4 flex-wrap">
                        <motion.button 
                          className="flex items-center gap-2 bg-transparent hover:bg-[var(--accent)] hover:text-white transition-colors text-xs px-3 py-1 rounded-md border border-[var(--accent)] text-[var(--accent)]"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details
                        </motion.button>
                        <motion.button 
                          className="flex items-center gap-2 bg-transparent hover:bg-[var(--accent)] hover:text-white transition-colors text-xs px-3 py-1 rounded-md border border-[var(--accent)] border-opacity-30 text-[var(--muted)]"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Related Projects
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Experience Summary */}
          <motion.div 
            className="mt-8 bg-[var(--secondary)] p-6 rounded-lg shadow-md border border-[var(--accent)] border-opacity-20 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] via-blue-500 to-transparent opacity-5 z-0"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--accent)] bg-opacity-10">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium">Looking for New Opportunities</h3>
              </div>
              
              <p className="text-[var(--muted)] mb-4">
                I'm currently open to new roles in software engineering and development. If you're looking for a passionate engineer with a strong foundation in modern technologies, let's connect.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <motion.a 
                  href="mailto:youremail@example.com" 
                  className="flex items-center gap-2 bg-gradient-to-r from-[var(--accent)] to-blue-500 text-white font-medium hover:opacity-90 transition-opacity px-4 py-2 rounded-md"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Me
                </motion.a>
                <motion.a 
                  href="/resume.pdf" 
                  target="_blank"
                  className="flex items-center gap-2 bg-transparent hover:bg-[var(--accent)] hover:text-white transition-colors text-sm px-4 py-2 border border-[var(--accent)] text-[var(--accent)]"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Download Resume
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section 
          id="skills" 
          className="min-h-[50vh] py-10 relative"
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            background: darkMode 
              ? "linear-gradient(135deg, rgba(20,20,22,0.7) 0%, rgba(35,35,40,0.5) 50%, rgba(20,20,22,0.7) 100%)" 
              : "linear-gradient(135deg, rgba(230,230,235,0.7) 0%, rgba(240,240,245,0.5) 50%, rgba(230,230,235,0.7) 100%)",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "3rem",
              boxShadow: darkMode
              ? "inset 0 0 30px rgba(0,0,0,0.3)"
              : "inset 0 0 30px rgba(0,0,0,0.05)",
            marginBottom: "2rem"
          }}
        >
          {/* Background decoration elements */}
          <div className="absolute top-20 right-0 w-64 h-64 rounded-full opacity-10 z-0 will-change-transform" 
            style={{ 
              background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
              filter: "blur(40px)",
              transform: "translateZ(0)"  // Force GPU acceleration
            }} 
          />
          <div className="absolute bottom-20 left-0 w-40 h-40 rounded-full opacity-10 z-0 will-change-transform" 
            style={{ 
              background: "radial-gradient(circle, #3498db 0%, transparent 70%)",
              filter: "blur(30px)",
              transform: "translateZ(0)"  // Force GPU acceleration
            }} 
          />
          
          <div className="mb-10 relative">
        <motion.h2 
              className="text-4xl font-semibold relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
          style={{
                background: "linear-gradient(90deg, var(--accent), #3498db, var(--accent))",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "var(--gradient-animation)"
              }}
            >
              Technical Skills
        </motion.h2>
            <motion.div 
              className="absolute -bottom-3 left-0 h-1 bg-gradient-to-r from-[var(--accent)] via-blue-500 to-transparent w-32"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 128, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.p 
              className="text-[var(--muted)] mt-2 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              My evolving toolkit of technologies, languages and frameworks
            </motion.p>
          </div>

          {/* Skills Categories - Enhanced with animations and better visuals */}
          
          {/* Skill Grid with redesigned skill cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-10">
            {skills
              .map((skill, index) => (
        <motion.div
                key={index}
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.03 }}
                className="transition-all duration-300"
              >
                <div 
                  className="block overflow-hidden rounded-lg border border-[var(--accent)] border-opacity-20 shadow-sm hover:shadow-lg"
                >
                  <div className="flex flex-col items-center p-5 bg-[var(--secondary)] hover:bg-opacity-80 transition-colors duration-300 relative h-full">
                    {/* Gradient background for card */}
                    <div className="absolute inset-0 bg-[var(--accent)] opacity-5 z-0"></div>
                    
                    {/* Skill Icon with Circular Progress */}
                    <div className="relative mb-3 z-10">
                      <svg width="70" height="70" viewBox="0 0 100 100">
                        <circle 
                          cx="50" cy="50" r="40" 
                          stroke="var(--accent)"
                          strokeOpacity="0.2"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <motion.circle 
                          cx="50" cy="50" r="40" 
                          stroke="url(#skillGradient)"
                          strokeWidth="8"
                          fill="transparent"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={0}
                          initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                          whileInView={{ strokeDashoffset: 0 }}
                          transition={{ duration: 1.5, delay: 0.2 + index * 0.1 }}
                          viewport={{ once: true }}
                        />
                        <defs>
                          <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--accent)" />
                            <stop offset="100%" stopColor="#3498db" />
                          </linearGradient>
                        </defs>
                        <foreignObject x="25" y="25" width="50" height="50">
                          <div className="flex items-center justify-center h-full">
                            <div className="text-[var(--accent)] scale-150">
                              {skill.icon}
                            </div>
                          </div>
                        </foreignObject>
                      </svg>
                    </div>
                    
                    {/* Skill Name */}
                    <h3 className="text-center font-medium text-base mb-1 relative z-10">
                      {skill.name}
                    </h3>
                    
                    {/* Skill Description */}
                    <p className="text-xs text-center text-[var(--muted)] relative z-10">
                      {skill.description}
                    </p>
                    
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Skills Summary - Enhanced with gradient and better layout */}
          <motion.div 
            className="bg-[var(--secondary)] p-6 rounded-lg shadow-md border border-[var(--accent)] border-opacity-20 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] via-blue-500 to-transparent opacity-5 z-0"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--accent)] bg-opacity-10">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium">Skills Summary</h3>
              </div>
              
              <p className="text-[var(--muted)] text-sm mb-6">
                My technical toolkit spans from frontend and backend development to data science and DevOps. I'm continuously learning new technologies to stay current with industry trends.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="bg-[var(--bg)] p-4 rounded-lg text-center transform transition-transform hover:scale-105">
                  <div className="text-3xl font-bold text-[var(--accent)]">4+</div>
                  <div className="text-xs text-[var(--muted)]">Years Coding</div>
                </div>
                <div className="bg-[var(--bg)] p-4 rounded-lg text-center transform transition-transform hover:scale-105">
                  <div className="text-3xl font-bold text-[var(--accent)]">10+</div>
                  <div className="text-xs text-[var(--muted)]">Technologies</div>
                </div>
                <div className="bg-[var(--bg)] p-4 rounded-lg text-center transform transition-transform hover:scale-105">
                  <div className="text-3xl font-bold text-[var(--accent)]">20+</div>
                  <div className="text-xs text-[var(--muted)]">Projects</div>
                </div>
                <div className="bg-[var(--bg)] p-4 rounded-lg text-center transform transition-transform hover:scale-105">
                  <div className="text-3xl font-bold text-[var(--accent)]">100+</div>
                  <div className="text-xs text-[var(--muted)]">Contributions</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section 
          id="current-projects" 
          className="min-h-[50vh] py-10 relative"
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            background: darkMode 
              ? "linear-gradient(135deg, rgba(20,20,22,0.7) 0%, rgba(35,35,40,0.5) 50%, rgba(20,20,22,0.7) 100%)" 
              : "linear-gradient(135deg, rgba(230,230,235,0.7) 0%, rgba(240,240,245,0.5) 50%, rgba(230,230,235,0.7) 100%)",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "3rem",
              boxShadow: darkMode
              ? "inset 0 0 30px rgba(0,0,0,0.3)"
              : "inset 0 0 30px rgba(0,0,0,0.05)",
            marginBottom: "2rem"
          }}
        >
          {/* Background decorative elements */}
          <div className="absolute top-10 right-0 w-64 h-64 rounded-full opacity-10 z-0 will-change-transform" 
            style={{ 
              background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
              filter: "blur(40px)",
              transform: "translateZ(0)"  // Force GPU acceleration
            }} 
          />
          <div className="absolute bottom-10 left-0 w-40 h-40 rounded-full opacity-10 z-0 will-change-transform" 
            style={{ 
              background: "radial-gradient(circle, #3498db 0%, transparent 70%)",
              filter: "blur(30px)",
              transform: "translateZ(0)"  // Force GPU acceleration
            }} 
          />
          
          <div className="mb-10 relative">
            <motion.h2 
              className="text-4xl font-semibold relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background: "linear-gradient(90deg, var(--accent), #3498db, var(--accent))",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "var(--gradient-animation)"
              }}
            >
              <a 
                href="https://github.com/CodingFreeze/ai-code-assistant" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline text-inherit transition-colors group-hover:text-[var(--accent)]"
                style={{ color: 'var(--text)' }}
              >
                What I'm Building
              </a>
            </motion.h2>
            <motion.div 
              className="absolute -bottom-3 left-0 h-1 bg-gradient-to-r from-[var(--accent)] via-blue-500 to-transparent w-32"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 128, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.p 
              className="text-[var(--muted)] mt-2 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Current projects I'm actively developing, from concept to completion
            </motion.p>
          </div>
          
          <div className="space-y-10">
            {/* Project 1 */}
            <div className="bg-[var(--secondary)] rounded-lg overflow-hidden shadow-lg border border-[var(--accent)] border-opacity-20 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative p-6 flex flex-col justify-between overflow-hidden">
                  <div className="absolute inset-0 bg-[var(--accent)] opacity-20 z-0"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[var(--secondary)] via-transparent to-[var(--secondary)] opacity-10 z-0"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-2">
                      <a 
                        href="https://github.com/CodingFreeze/ai-code-assistant" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline text-inherit transition-colors group-hover:text-[var(--accent)]"
                        style={{ color: 'var(--text)' }}
                      >
                        AI Code Assistant
                      </a>
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-sm text-[var(--muted)]">Active Development</span>
                    </div>
                    <p className="text-sm text-[var(--muted)] mb-4">
                      Building an IDE extension that helps developers write better code through AI-powered suggestions, documentation, and refactoring.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4 relative z-10">
                    <span className="px-2 py-1 text-xs rounded-md bg-[var(--bg)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-white transition-colors duration-200">TypeScript</span>
                    <span className="px-2 py-1 text-xs rounded-md bg-[var(--bg)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-white transition-colors duration-200">React</span>
                    <span className="px-2 py-1 text-xs rounded-md bg-[var(--bg)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-white transition-colors duration-200">OpenAI API</span>
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <h4 className="font-medium text-lg">Progress Highlights</h4>
                    <div className="text-sm px-3 py-1 rounded-full bg-[var(--accent)] bg-opacity-20 text-white font-medium whitespace-nowrap">
                      Est. Completion: Q3 2023
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center text-white mt-0.5">✓</div>
                      <div>
                        <p className="font-medium">Set up VS Code extension infrastructure</p>
                        <p className="text-sm text-[var(--muted)]">Created the basic extension structure with TypeScript and VS Code API</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center text-white mt-0.5">✓</div>
                      <div>
                        <p className="font-medium">Integrated OpenAI API for code completions</p>
                        <p className="text-sm text-[var(--muted)]">Added support for generating code suggestions based on context</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] mt-0.5">⟳</div>
                      <div>
                        <p className="font-medium">Building context-aware code documentation</p>
                        <p className="text-sm text-[var(--muted)]">Working on generating documentation for functions and classes</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-[var(--accent)] border-opacity-10">
                    <h5 className="text-sm font-medium mb-2">Timeline</h5>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[var(--bg)]">
                        <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[var(--accent)]"></div>
                      </div>
                      <div className="flex justify-between text-xs text-[var(--muted)]">
                        <span>Start</span>
                        <span>Current</span>
                        <span>MVP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="bg-[var(--secondary)] rounded-lg overflow-hidden shadow-lg border border-[var(--accent)] border-opacity-20 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative p-6 flex flex-col justify-between overflow-hidden">
                  <div className="absolute inset-0 bg-[var(--accent)] opacity-20 z-0"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[var(--secondary)] via-transparent to-[var(--secondary)] opacity-10 z-0"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-2">
                      <a 
                        href="https://github.com/CodingFreeze/finance-dashboard" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline text-inherit transition-colors group-hover:text-[var(--accent)]"
                        style={{ color: 'var(--text)' }}
                      >
                        Personal Finance Dashboard
                      </a>
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
                      <span className="text-sm text-[var(--muted)]">Planning Phase</span>
                    </div>
                    <p className="text-sm text-[var(--muted)] mb-4">
                      Developing a customizable dashboard for tracking personal finances, investments, and financial goals with interactive visualizations.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4 relative z-10">
                    <span className="px-2 py-1 text-xs rounded-md bg-[var(--bg)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-white transition-colors duration-200">Next.js</span>
                    <span className="px-2 py-1 text-xs rounded-md bg-[var(--bg)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-white transition-colors duration-200">D3.js</span>
                    <span className="px-2 py-1 text-xs rounded-md bg-[var(--bg)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-white transition-colors duration-200">Firebase</span>
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <h4 className="font-medium text-lg">Project Plan</h4>
                    <div className="text-sm px-3 py-1 rounded-full bg-[var(--accent)] bg-opacity-20 text-white font-medium whitespace-nowrap">
                      Est. Completion: Q4 2023
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center text-white mt-0.5">✓</div>
                      <div>
                        <p className="font-medium">Research existing finance tools</p>
                        <p className="text-sm text-[var(--muted)]">Analyzed strengths and weaknesses of popular personal finance applications</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[var(--accent)] bg-opacity-50 flex items-center justify-center text-white mt-0.5">⟳</div>
                      <div>
                        <p className="font-medium">Design UI mockups and user flows</p>
                        <p className="text-sm text-[var(--muted)]">Creating wireframes and interactive prototypes in Figma</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border border-dashed border-[var(--accent)] flex items-center justify-center text-[var(--accent)] mt-0.5">◯</div>
                      <div>
                        <p className="font-medium">Set up Next.js project and authentication</p>
                        <p className="text-sm text-[var(--muted)]">Planning to implement secure user authentication with NextAuth.js</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-[var(--accent)] border-opacity-10">
                    <h5 className="text-sm font-medium mb-2">Timeline</h5>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[var(--bg)]">
                        <div style={{ width: "25%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[var(--accent)]"></div>
                      </div>
                      <div className="flex justify-between text-xs text-[var(--muted)]">
                        <span>Project Start</span>
                        <span>Design Phase</span>
                        <span>Development</span>
                        <span>Launch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          id="coursework" 
          className="min-h-[50vh] py-10 relative"
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            background: darkMode 
              ? "linear-gradient(135deg, rgba(20,20,22,0.7) 0%, rgba(35,35,40,0.5) 50%, rgba(20,20,22,0.7) 100%)" 
              : "linear-gradient(135deg, rgba(230,230,235,0.7) 0%, rgba(240,240,245,0.5) 50%, rgba(230,230,235,0.7) 100%)",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "3rem",
              boxShadow: darkMode
              ? "inset 0 0 30px rgba(0,0,0,0.3)"
              : "inset 0 0 30px rgba(0,0,0,0.05)",
            marginBottom: "2rem"
          }}
        >
          <h2 className="text-4xl font-semibold mb-10"
            style={{
              background: "linear-gradient(90deg, var(--accent), #3498db, var(--accent))",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "var(--gradient-animation)"
            }}
          >
            <a 
              href="/notes" 
            >
              Coursework
            </a>
          </h2>
          
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-2 border-b border-[var(--divider)] pb-2">
              <button 
                className={`px-4 py-2 font-medium rounded-t-lg flex items-center gap-2 ${activeCourseTab === 'completed' ? 'bg-[var(--secondary)] text-[var(--accent)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
                onClick={() => setActiveCourseTab('completed')}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Completed</span>
              </button>
              <button 
                className={`px-4 py-2 font-medium rounded-t-lg flex items-center gap-2 ${activeCourseTab === 'current' ? 'bg-[var(--secondary)] text-[var(--accent)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
                onClick={() => setActiveCourseTab('current')}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Current</span>
              </button>
              <button 
                className={`px-4 py-2 font-medium rounded-t-lg flex items-center gap-2 ${activeCourseTab === 'upcoming' ? 'bg-[var(--secondary)] text-[var(--accent)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
                onClick={() => setActiveCourseTab('upcoming')}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>Upcoming</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {/* Completed Courses Tab Content */}
              {activeCourseTab === 'completed' && (
                <motion.div 
                  key="completed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {/* Course cards for Completed Courses */}
                  <motion.div 
                    className="bg-[var(--secondary)] p-6 rounded-lg h-[160px] flex flex-col"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-medium">Advanced Machine Learning</h4>
                      <div className="relative w-10 h-10 flex items-center justify-center bg-teal-500 bg-opacity-10 rounded-full">
                        <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 bg-opacity-20 text-blue-500 border border-blue-500 border-opacity-30">Theory</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500 bg-opacity-20 text-purple-500 border border-purple-500 border-opacity-30">Practical</span>
                    </div>
                    <p className="text-[var(--muted)] text-sm">Deep learning, neural networks, and advanced ML algorithms</p>
                    <div className="mt-auto"></div>
                  </motion.div>

                  <motion.div 
                    className="bg-[var(--secondary)] p-6 rounded-lg h-[160px] flex flex-col"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-medium">Cloud Computing</h4>
                      <div className="relative w-10 h-10 flex items-center justify-center bg-teal-500 bg-opacity-10 rounded-full">
                        <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-500 bg-opacity-20 text-green-500 border border-green-500 border-opacity-30">DevOps</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500 bg-opacity-20 text-purple-500 border border-purple-500 border-opacity-30">Practical</span>
                    </div>
                    <p className="text-[var(--muted)] text-sm">AWS, Azure, and cloud architecture principles</p>
                    <div className="mt-auto"></div>
                  </motion.div>

                  <motion.div 
                    className="bg-[var(--secondary)] p-6 rounded-lg h-[160px] flex flex-col"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-medium">Distributed Systems</h4>
                      <div className="relative w-10 h-10 flex items-center justify-center bg-teal-500 bg-opacity-10 rounded-full">
                        <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 bg-opacity-20 text-blue-500 border border-blue-500 border-opacity-30">Theory</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-orange-500 bg-opacity-20 text-orange-500 border border-orange-500 border-opacity-30">Research</span>
                    </div>
                    <p className="text-[var(--muted)] text-sm">System design, scalability, and distributed computing</p>
                    <div className="mt-auto"></div>
                  </motion.div>

                  <motion.div 
                    className="bg-[var(--secondary)] p-6 rounded-lg h-[160px] flex flex-col"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-medium">Database Management</h4>
                      <div className="relative w-10 h-10 flex items-center justify-center bg-teal-500 bg-opacity-10 rounded-full">
                        <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500 bg-opacity-20 text-purple-500 border border-purple-500 border-opacity-30">Practical</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-500 bg-opacity-20 text-green-500 border border-green-500 border-opacity-30">DevOps</span>
                    </div>
                    <p className="text-[var(--muted)] text-sm">SQL, NoSQL, and database optimization techniques</p>
                    <div className="mt-auto"></div>
                  </motion.div>
                </motion.div>
              )}
              
              {/* Current Courses Tab Content */}
              {activeCourseTab === 'current' && (
                <motion.div 
                  key="current"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {/* Course cards for Current Courses */}
                  <motion.div 
                    className="bg-[var(--secondary)] p-6 rounded-lg h-[160px] flex flex-col"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-medium">Web Development</h4>
                      <div className="relative w-10 h-10 flex items-center justify-center bg-teal-500 bg-opacity-10 rounded-full">
                        <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500 bg-opacity-20 text-purple-500 border border-purple-500 border-opacity-30">Practical</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 bg-opacity-20 text-blue-500 border border-blue-500 border-opacity-30">Frontend</span>
                    </div>
                    <p className="text-[var(--muted)] text-sm">Full-stack development with modern frameworks and tools</p>
                    <div className="mt-auto"></div>
                  </motion.div>

                  <motion.div 
                    className="bg-[var(--secondary)] p-6 rounded-lg h-[160px] flex flex-col"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-medium">Algorithm Design</h4>
                      <div className="relative w-10 h-10 flex items-center justify-center bg-teal-500 bg-opacity-10 rounded-full">
                        <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 bg-opacity-20 text-blue-500 border border-blue-500 border-opacity-30">Theory</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500 bg-opacity-20 text-yellow-500 border border-yellow-500 border-opacity-30">Algorithms</span>
                    </div>
                    <p className="text-[var(--muted)] text-sm">Advanced algorithms and optimization techniques</p>
                    <div className="mt-auto"></div>
                  </motion.div>

                  <motion.div 
                    className="bg-[var(--secondary)] p-6 rounded-lg h-[160px] flex flex-col"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-medium">Computer Networks</h4>
                      <div className="relative w-10 h-10 flex items-center justify-center bg-teal-500 bg-opacity-10 rounded-full">
                        <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 bg-opacity-20 text-blue-500 border border-blue-500 border-opacity-30">Theory</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-500 bg-opacity-20 text-green-500 border border-green-500 border-opacity-30">DevOps</span>
                    </div>
                    <p className="text-[var(--muted)] text-sm">Network protocols, security, and distributed systems</p>
                    <div className="mt-auto"></div>
                  </motion.div>

                  <motion.div 
                    className="bg-[var(--secondary)] p-6 rounded-lg h-[160px] flex flex-col"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-medium">Artificial Intelligence</h4>
                      <div className="relative w-10 h-10 flex items-center justify-center bg-teal-500 bg-opacity-10 rounded-full">
                        <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 bg-opacity-20 text-blue-500 border border-blue-500 border-opacity-30">Theory</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-teal-500 bg-opacity-20 text-teal-500 border border-teal-500 border-opacity-30">ML/AI</span>
                    </div>
                    <p className="text-[var(--muted)] text-sm">AI Systems, natural language processing, and computer vision</p>
                    <div className="mt-auto"></div>
                  </motion.div>
                </motion.div>
              )}
              
              {/* Upcoming Courses Tab Content */}
              {activeCourseTab === 'upcoming' && (
                <motion.div 
                  key="upcoming"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {/* Course cards for Upcoming Courses */}
                  <motion.div 
                    className="bg-[var(--secondary)] p-6 rounded-lg h-[160px] flex flex-col"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-medium">Cybersecurity</h4>
                      <div className="relative w-10 h-10 flex items-center justify-center bg-teal-500 bg-opacity-10 rounded-full">
                        <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-500 bg-opacity-20 text-red-500 border border-red-500 border-opacity-30">Security</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500 bg-opacity-20 text-purple-500 border border-purple-500 border-opacity-30">Practical</span>
                    </div>
                    <p className="text-[var(--muted)] text-sm">Network security, ethical hacking, and threat analysis</p>
                    <div className="mt-auto"></div>
                  </motion.div>

                  <motion.div 
                    className="bg-[var(--secondary)] p-6 rounded-lg h-[160px] flex flex-col"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-medium">Mobile Development</h4>
                      <div className="relative w-10 h-10 flex items-center justify-center bg-teal-500 bg-opacity-10 rounded-full">
                        <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500 bg-opacity-20 text-purple-500 border border-purple-500 border-opacity-30">Practical</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 bg-opacity-20 text-blue-500 border border-blue-500 border-opacity-30">Frontend</span>
                    </div>
                    <p className="text-[var(--muted)] text-sm">iOS, Android, and cross-platform app development</p>
                    <div className="mt-auto"></div>
                  </motion.div>

                  <motion.div 
                    className="bg-[var(--secondary)] p-6 rounded-lg h-[160px] flex flex-col"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-medium">Game Development</h4>
                      <div className="relative w-10 h-10 flex items-center justify-center bg-teal-500 bg-opacity-10 rounded-full">
                        <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500 bg-opacity-20 text-purple-500 border border-purple-500 border-opacity-30">Practical</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500 bg-opacity-20 text-yellow-500 border border-yellow-500 border-opacity-30">Graphics</span>
                    </div>
                    <p className="text-[var(--muted)] text-sm">Graphics programming, game engines, and interactive design</p>
                    <div className="mt-auto"></div>
                  </motion.div>

                  <motion.div 
                    className="bg-[var(--secondary)] p-6 rounded-lg h-[160px] flex flex-col"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-medium">Blockchain Technology</h4>
                      <div className="relative w-10 h-10 flex items-center justify-center bg-teal-500 bg-opacity-10 rounded-full">
                        <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 bg-opacity-20 text-blue-500 border border-blue-500 border-opacity-30">Theory</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500 bg-opacity-20 text-amber-500 border border-amber-500 border-opacity-30">Blockchain</span>
                    </div>
                    <p className="text-[var(--muted)] text-sm">Cryptocurrency, smart contracts, and decentralized applications</p>
                    <div className="mt-auto"></div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        <motion.section 
          id="passions" 
          className="min-h-[50vh] py-10 relative"
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            background: darkMode 
              ? "linear-gradient(135deg, rgba(20,20,22,0.7) 0%, rgba(35,35,40,0.5) 50%, rgba(20,20,22,0.7) 100%)" 
              : "linear-gradient(135deg, rgba(230,230,235,0.7) 0%, rgba(240,240,245,0.5) 50%, rgba(230,230,235,0.7) 100%)",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "3rem",
            boxShadow: darkMode
              ? "inset 0 0 30px rgba(0,0,0,0.3)"
              : "inset 0 0 30px rgba(0,0,0,0.05)",
            marginBottom: "2rem"
          }}
        >
          <h2 className="text-4xl font-semibold mb-10"
            style={{
              background: "linear-gradient(90deg, var(--accent), #3498db, var(--accent))",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "var(--gradient-animation)"
            }}
          >
            <a 
              href="/thoughts" 
            >
              Passions
            </a>
          </h2>
          
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-2 border-b border-[var(--divider)] pb-2">
              <button 
                className={`px-4 py-2 font-medium rounded-t-lg flex items-center gap-2 ${activeTab === 'technical' ? 'bg-[var(--secondary)] text-[var(--accent)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
                onClick={() => setActiveTab('technical')}
              >
                <FaLaptopCode size={18} />
                <span>Technical</span>
              </button>
              <button 
                className={`px-4 py-2 font-medium rounded-t-lg flex items-center gap-2 ${activeTab === 'creative' ? 'bg-[var(--secondary)] text-[var(--accent)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
                onClick={() => setActiveTab('creative')}
              >
                <FaPalette size={18} />
                <span>Creative</span>
              </button>
              <button 
                className={`px-4 py-2 font-medium rounded-t-lg flex items-center gap-2 ${activeTab === 'lifestyle' ? 'bg-[var(--secondary)] text-[var(--accent)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
                onClick={() => setActiveTab('lifestyle')}
              >
                <FaLeaf size={18} />
                <span>Lifestyle</span>
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {/* Technical Tab Content */}
              {activeTab === 'technical' && (
                <motion.div 
                  key="technical"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {/* Tile 1 */}
                  <motion.div 
                    className="bg-[var(--secondary)] rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--accent)] opacity-80"></div>
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <FaCode className="text-white w-12 h-12" />
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-semibold mb-2">Algorithms</h4>
                      <p className="text-[var(--muted)]">Solving complex problems through elegant and efficient algorithmic solutions.</p>
                    </div>
                  </motion.div>
                  
                  {/* Tile 2 */}
                  <motion.div 
                    className="bg-[var(--secondary)] rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--accent)] opacity-80"></div>
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <FaUserAstronaut className="text-white w-12 h-12" />
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-semibold mb-2">AI Research</h4>
                      <p className="text-[var(--muted)]">Exploring machine learning models and their applications in solving real-world problems.</p>
                    </div>
                  </motion.div>
                  
                  {/* Tile 3 */}
                  <motion.div 
                    className="bg-[var(--secondary)] rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--accent)] opacity-80"></div>
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <FaGithub className="text-white w-12 h-12" />
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-semibold mb-2">Open Source</h4>
                      <p className="text-[var(--muted)]">Contributing to and creating projects that benefit the developer community.</p>
                    </div>
                  </motion.div>
                  
                  {/* Tile 4 */}
                  <motion.div 
                    className="bg-[var(--secondary)] rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--accent)] opacity-80"></div>
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <FaDatabase className="text-white w-12 h-12" />
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-semibold mb-2">Data Science</h4>
                      <p className="text-[var(--muted)]">Analyzing and visualizing data to extract meaningful insights and patterns.</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              
              {/* Creative Tab Content */}
              {activeTab === 'creative' && (
                <motion.div 
                  key="creative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {/* Tile 1 */}
                  <motion.div 
                    className="bg-[var(--secondary)] rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--accent)] opacity-80"></div>
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <FaMusic className="text-white w-12 h-12" />
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-semibold mb-2">Music Production</h4>
                      <p className="text-[var(--muted)]">Creating electronic music, composing, and experimenting with audio processing.</p>
                    </div>
                  </motion.div>
                  
                  {/* Tile 2 */}
                  <motion.div 
                    className="bg-[var(--secondary)] rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--accent)] opacity-80"></div>
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <FaCamera className="text-white w-12 h-12" />
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-semibold mb-2">Photography</h4>
                      <p className="text-[var(--muted)]">Capturing moments and exploring visual storytelling through the lens.</p>
                    </div>
                  </motion.div>
                  
                  {/* Tile 3 */}
                  <motion.div 
                    className="bg-[var(--secondary)] rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--accent)] opacity-80"></div>
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <FaBookOpen className="text-white w-12 h-12" />
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-semibold mb-2">Creative Writing</h4>
                      <p className="text-[var(--muted)]">Crafting narratives, poetry, and essays to express ideas and emotions.</p>
                    </div>
                  </motion.div>
                  
                  {/* Tile 4 */}
                  <motion.div 
                    className="bg-[var(--secondary)] rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--accent)] opacity-80"></div>
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <FaPalette className="text-white w-12 h-12" />
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-semibold mb-2">Digital Art</h4>
                      <p className="text-[var(--muted)]">Creating visual designs and illustrations using digital tools and techniques.</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              
              {/* Lifestyle Tab Content */}
              {activeTab === 'lifestyle' && (
                <motion.div 
                  key="lifestyle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {/* Tile 1 */}
                  <motion.div 
                    className="bg-[var(--secondary)] rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--accent)] opacity-80"></div>
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <FaHiking className="text-white w-12 h-12" />
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-semibold mb-2">Hiking</h4>
                      <p className="text-[var(--muted)]">Exploring nature trails and summiting peaks to reconnect with the natural world.</p>
                    </div>
                  </motion.div>
                  
                  {/* Tile 2 */}
                  <motion.div 
                    className="bg-[var(--secondary)] rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--accent)] opacity-80"></div>
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <FaChess className="text-white w-12 h-12" />
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-semibold mb-2">Chess</h4>
                      <p className="text-[var(--muted)]">Enjoying the strategic depth and mental challenge of the royal game.</p>
                    </div>
                  </motion.div>
                  
                  {/* Tile 3 */}
                  <motion.div 
                    className="bg-[var(--secondary)] rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--accent)] opacity-80"></div>
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <FaGamepad className="text-white w-12 h-12" />
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-semibold mb-2">Gaming</h4>
                      <p className="text-[var(--muted)]">Playing story-rich games and competitive esports to unwind and connect with friends.</p>
                    </div>
                  </motion.div>
                  
                  {/* Tile 4 */}
                  <motion.div 
                    className="bg-[var(--secondary)] rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--accent)] opacity-80"></div>
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <FaGlobeAmericas className="text-white w-12 h-12" />
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-semibold mb-2">Travel</h4>
                      <p className="text-[var(--muted)]">Exploring diverse cultures, cuisines, and landscapes across the globe.</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>

      <motion.footer
        className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-3 text-[var(--muted)] text-sm py-6 pb-8 border-t w-full px-0 mt-auto"
        style={{ 
          borderColor: 'var(--divider)',
          backgroundColor: 'var(--bg)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="px-6 sm:px-8 md:px-12 lg:px-16 text-base">© {new Date().getFullYear()} Abdullah Rana. All rights reserved.</div>
        <div className="flex items-center gap-3 px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="flex gap-4 text-xl">
            <a href="https://github.com/CodingFreeze" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-[var(--accent)] transition-colors">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/abdullahranaofc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[var(--accent)] transition-colors">
              <FaLinkedin />
            </a>
            <a href="mailto:abdullahranaofc@gmail.com" aria-label="Email" className="hover:text-[var(--accent)] transition-colors">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </motion.footer>

      {/* Back to Top Button */}
      <motion.button
        onClick={() => {
          // Use a smoother scroll with a better easing function
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }}
        className="fixed bottom-2 right-8 p-3 rounded-full bg-[var(--accent)] text-white shadow-lg z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: scrollYProgress > 0.2 ? 1 : 0,
          y: scrollYProgress > 0.2 ? 0 : 20
        }}
        aria-label="Back to top"
      >
        <ArrowUp size={24} />
      </motion.button>

      {/* Add text animations to section titles */}
      <style jsx global>{`
        :root {
          --gradient-animation: gradient 8s linear infinite;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .theme-transition * {
          transition: background-color 0.6s ease, color 0.6s ease, border-color 0.6s ease, fill 0.6s ease !important;
        }
      `}</style>

      {/* Add a floating element behind the content */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1, maxHeight: "100vh" }}>
        <motion.div
          className="absolute w-[200px] h-[200px] rounded-full opacity-5 will-change-transform"
          style={{
            background: `var(--accent)`,
            filter: "blur(60px)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) translateZ(0)"  // Force GPU acceleration
          }}
          animate={{
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{
            duration: 15, // Increased from 10 for less frequent updates
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute w-[150px] h-[150px] rounded-full opacity-3 will-change-transform"
          style={{
            background: `var(--accent)`,
            filter: "blur(50px)",
            top: "30%",
            right: "10%",
            transform: "translateZ(0)"  // Force GPU acceleration
          }}
          animate={{
            opacity: [0.02, 0.04, 0.02]
          }}
          transition={{
            duration: 20, // Increased from 15 for less frequent updates
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute w-[150px] h-[150px] rounded-full opacity-3 will-change-transform"
          style={{
            background: `var(--accent)`,
            filter: "blur(50px)",
            bottom: "10%",
            left: "10%",
            transform: "translateZ(0)"  // Force GPU acceleration
          }}
          animate={{
            opacity: [0.02, 0.04, 0.02]
          }}
          transition={{
            duration: 18, // Increased from 12 for less frequent updates
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
}
// Fix ParticleEffect component - restore it in case it's needed elsewhere
const ParticleEffect = ({ className }) => {
  const [darkMode] = useState(true); // Just for initial render; will be overridden by context
  
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      {[...Array(6)].map((_, i) => (  // Reduced from 10 to 6 particles
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full will-change-transform"
          initial={{ 
            opacity: 0, 
            scale: 0,
            transform: "translateZ(0)"  // Force GPU acceleration
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1.8, 0],
            x: Math.random() * 40 - 20, // Reduced range from 60 to 40
            y: Math.random() * 40 - 20, // Reduced range from 60 to 40
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.1, // Increased from 0.05 to 0.1
            repeat: Infinity,
            repeatDelay: 2 // Increased from 1.5 to 2
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: 'var(--accent)',
            boxShadow: '0 0 5px var(--accent)'
          }}
        />
      ))}
    </div>
  );
};

