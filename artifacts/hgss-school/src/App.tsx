import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Facebook, Twitter, Instagram, Youtube, Menu, X, Phone, Mail, MapPin, ChevronRight, BookOpen, FlaskConical, Monitor, Trophy, Sparkles, Palette, FileText, CheckCircle2, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import galleryBuilding from "../assets/images/gallery-building.png";
import galleryClassroom from "../assets/images/gallery-classroom.png";
import galleryLibrary from "../assets/images/gallery-library.png";
import gallerySports from "../assets/images/gallery-sports.png";
import galleryAnnualFunction from "../assets/images/gallery-annual-function.png";
import galleryScienceLab from "../assets/images/gallery-science-lab.png";

const AnimatedCounter = ({ end, suffix = "", text }: { end: number; suffix?: string; text: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 2000;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end]);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="text-4xl font-serif font-bold mb-2" style={{ color: "#D4A017" }}>
        {count}{suffix}
      </div>
      <div className="text-sm uppercase tracking-widest text-white/90 font-medium">{text}</div>
    </div>
  );
};

const navLinks = [
  { name: "Home", id: "home" },
  { name: "About Us", id: "about" },
  { name: "Academics", id: "academics" },
  { name: "Facilities", id: "facilities" },
  { name: "Notice Board", id: "notice-board" },
  { name: "Admissions", id: "admissions" },
  { name: "Contact Us", id: "contact" },
];

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      {/* 1. TOP BAR */}
      <div className="bg-primary text-white text-xs py-2 px-4 flex flex-col sm:flex-row justify-between items-center z-50 relative">
        <div className="flex items-center gap-4 mb-2 sm:mb-0">
          <a href="tel:+91XXXXXXXXXX" className="flex items-center gap-1.5 hover:text-yellow-300 transition-colors">
            <Phone size={12} />
            <span>+91-XXXXXXXXXX</span>
          </a>
          <a href="mailto:info@hgsschool.edu.in" className="flex items-center gap-1.5 hover:text-yellow-300 transition-colors">
            <Mail size={12} />
            <span>info@hgsschool.edu.in</span>
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a href="#" className="hover:text-orange-400 transition-colors"><Facebook size={14} /></a>
          <a href="#" className="hover:text-orange-400 transition-colors"><Twitter size={14} /></a>
          <a href="#" className="hover:text-orange-400 transition-colors"><Instagram size={14} /></a>
          <a href="#" className="hover:text-orange-400 transition-colors"><Youtube size={14} /></a>
        </div>
      </div>

      {/* 2. HEADER */}
      <div className="relative overflow-hidden" style={{ backgroundColor: "#FFF8F0" }}>
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(#8B0000 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-lg shrink-0" style={{ backgroundColor: "#D4A017" }}>
            <span className="text-4xl">🏫</span>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-2">Hindu Girls Senior Secondary School</h1>
            <p className="text-sm md:text-base font-medium tracking-wide text-foreground/80 uppercase">Estd. 1974 | CBSE Affiliated | Girls Only</p>
          </div>
        </div>
        <div className="w-full h-1 opacity-50" style={{ background: "linear-gradient(to right, transparent, #D4A017, transparent)" }} />
      </div>

      {/* 3. STICKY NAVIGATION BAR */}
      <div
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          isScrolled ? "shadow-md py-3 bg-primary" : "py-4 border-b"
        )}
        style={!isScrolled ? { backgroundColor: "#FFF8F0", borderColor: "#e2d1c3" } : {}}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="hidden md:flex items-center justify-center w-full gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={cn(
                  "text-sm font-semibold tracking-wide uppercase transition-colors",
                  isScrolled ? "text-white hover:text-orange-300" : "text-primary hover:text-orange-500"
                )}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="md:hidden flex w-full justify-between items-center">
            <span className={cn("font-serif font-bold", isScrolled ? "text-white" : "text-primary")}>HGSS</span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(isScrolled ? "text-white" : "text-primary")}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-primary text-white shadow-xl py-4 flex flex-col items-center gap-4 md:hidden border-t border-white/10">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-semibold tracking-wide uppercase py-2 w-full hover:bg-white/10 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
        <div
          className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at center, #D4A017 2px, transparent 2px)", backgroundSize: "40px 40px" }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))" }} />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-block bg-black/20 backdrop-blur-sm px-6 py-2 rounded-full border border-yellow-500/30"
          >
            <span className="font-serif text-xl md:text-2xl" style={{ color: "#D4A017" }}>&ldquo;&#2357;&#2367;&#2342;&#2381;&#2351;&#2366; &#2342;&#2342;&#2366;&#2340;&#2367; &#2357;&#2367;&#2344;&#2351;&#2350;&#2381;&rdquo;</span>
            <span className="ml-2 text-white/80 text-sm italic">(Knowledge Bestows Humility)</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg max-w-4xl"
          >
            Shaping Tomorrow&apos;s{" "}
            <span style={{ color: "#D4A017" }}>Leaders</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-10 max-w-2xl font-light text-white/90"
          >
            Empowering Girls through Education, Values &amp; Excellence
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              onClick={() => scrollToSection("admissions")}
              className="text-white border-none text-lg px-8 py-6 rounded-sm shadow-lg"
              style={{ backgroundColor: "#FF6B00" }}
            >
              Apply Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("about")}
              className="bg-transparent text-lg px-8 py-6 rounded-sm backdrop-blur-sm border-2"
              style={{ borderColor: "#D4A017", color: "#D4A017" }}
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* 5. STATS STRIP */}
      <section className="bg-primary border-t border-white/10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            <AnimatedCounter end={1500} suffix="+" text="Total Students" />
            <AnimatedCounter end={80} suffix="+" text="Teachers" />
            <AnimatedCounter end={50} suffix="+" text="Years Excellence" />
            <AnimatedCounter end={99} suffix="%" text="Board Results" />
          </div>
        </div>
      </section>

      {/* 6. ABOUT SECTION */}
      <section id="about" className="py-24 relative" style={{ backgroundColor: "#FFF8F0" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto p-8 md:p-12 relative bg-white shadow-xl" style={{ border: "8px double rgba(139,0,0,0.1)" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4" style={{ backgroundColor: "#FFF8F0" }}>
              <span className="text-4xl" style={{ color: "#D4A017" }}>&#10087;</span>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-serif font-bold text-primary mb-6 relative inline-block">
                  Our Legacy
                  <div className="absolute -bottom-2 left-0 w-1/2 h-1" style={{ backgroundColor: "#FF6B00" }} />
                </h2>
                <p className="text-foreground/80 mb-6 leading-relaxed text-lg">
                  Established in 1974, Hindu Girls Senior Secondary School has been a beacon of women&apos;s education for over five decades. Founded with the vision of empowering young women through academic excellence and strong cultural roots, we have consistently nurtured leaders who make meaningful contributions to society.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-primary/5 border-l-4 border-primary">
                    <h3 className="font-serif font-bold text-primary text-xl mb-1">Our Mission</h3>
                    <p className="text-sm text-foreground/70 italic">&ldquo;To nurture young women with knowledge, character, and purpose.&rdquo;</p>
                  </div>
                  <div className="p-4 border-l-4" style={{ backgroundColor: "rgba(255,107,0,0.05)", borderColor: "#FF6B00" }}>
                    <h3 className="font-serif font-bold text-xl mb-1" style={{ color: "#FF6B00" }}>Our Vision</h3>
                    <p className="text-sm text-foreground/70 italic">&ldquo;Creating leaders who transform communities through education.&rdquo;</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "CBSE Affiliated", icon: <CheckCircle2 size={32} style={{ color: "#D4A017" }} className="mb-2" /> },
                  { title: "Hindi & English", icon: <BookOpen size={32} style={{ color: "#D4A017" }} className="mb-2" /> },
                  { title: "Girls Only", icon: <Trophy size={32} style={{ color: "#D4A017" }} className="mb-2" /> },
                  { title: "50+ Years", icon: <Sparkles size={32} style={{ color: "#D4A017" }} className="mb-2" /> },
                ].map((badge, idx) => (
                  <div
                    key={idx}
                    className="p-6 text-center border flex flex-col items-center justify-center hover:border-yellow-500 transition-colors group cursor-default"
                    style={{ backgroundColor: "#FFF8F0", borderColor: "#e2d1c3" }}
                  >
                    <div className="group-hover:scale-110 transition-transform duration-300">{badge.icon}</div>
                    <span className="font-bold text-primary">{badge.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ACADEMIC PROGRAMS */}
      <section id="academics" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">Academic Programs</h2>
            <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: "#D4A017" }} />
            <p className="text-foreground/70 max-w-2xl mx-auto">Comprehensive education structured to nurture growth at every developmental stage.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Primary",
                classes: "Class 1 - 5",
                desc: "Foundation of learning with core subjects — Mathematics, Science, Hindi, English, and Social Studies.",
                icon: <BookOpen size={40} className="text-white" />,
              },
              {
                title: "Middle School",
                classes: "Class 6 - 8",
                desc: "Expanding horizons with Science, Mathematics, Social Science, and introduction to Arts and Computers.",
                icon: <Sparkles size={40} className="text-white" />,
              },
              {
                title: "Senior Secondary",
                classes: "Class 9 - 12",
                desc: "Science, Commerce, and Humanities streams with board-focused preparation and career guidance.",
                icon: <Trophy size={40} className="text-white" />,
              },
            ].map((prog, idx) => (
              <div
                key={idx}
                className="group border p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden cursor-default"
                style={{ backgroundColor: "#FFF8F0", borderColor: "#e2d1c3" }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 z-0" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 shadow-md">
                    {prog.icon}
                  </div>
                  <div className="inline-block font-bold px-3 py-1 rounded text-sm mb-4 self-start text-primary" style={{ backgroundColor: "rgba(212,160,23,0.2)" }}>
                    {prog.classes}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-primary mb-3">{prog.title}</h3>
                  <p className="text-foreground/70">{prog.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FACILITIES GRID */}
      <section id="facilities" className="py-24" style={{ backgroundColor: "#FFF8F0" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">Campus Facilities</h2>
            <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: "#FF6B00" }} />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: <BookOpen />, title: "Library", desc: "10,000+ books, digital resources, and a quiet reading space for focused study." },
              { icon: <FlaskConical />, title: "Science Lab", desc: "Fully equipped Physics, Chemistry, and Biology laboratories." },
              { icon: <Monitor />, title: "Computer Lab", desc: "60+ modern systems with high-speed internet access." },
              { icon: <Trophy />, title: "Sports Ground", desc: "Athletics track, volleyball court, and indoor game facilities." },
              { icon: <Sparkles />, title: "Smart Classes", desc: "Interactive digital boards installed across all classrooms." },
              { icon: <Palette />, title: "Art Room", desc: "Dedicated space for painting, crafts, and cultural activities." },
            ].map((fac, idx) => (
              <div
                key={idx}
                className="bg-white p-6 border group hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-default"
                style={{ borderColor: "#e2d1c3" }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors group-hover:text-white"
                  style={{ backgroundColor: "rgba(255,107,0,0.1)", color: "#FF6B00" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "#FF6B00"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(255,107,0,0.1)"; }}
                >
                  {fac.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{fac.title}</h3>
                <p className="text-foreground/70 text-sm">{fac.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. NOTICE BOARD */}
      <section id="notice-board" className="py-24 relative" style={{ backgroundColor: "#e8d5c4" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto p-4 md:p-8 rounded-sm shadow-2xl" style={{ backgroundColor: "#8B0000", border: "12px solid #5c0000" }}>
            <div className="text-center mb-8 py-4 rounded shadow-inner border-2 mx-auto max-w-sm" style={{ backgroundColor: "#FFF8F0", borderColor: "#e2d1c3" }}>
              <h2 className="text-3xl font-serif font-bold text-primary tracking-widest uppercase">Notice Board</h2>
            </div>

            <div className="space-y-4">
              {[
                { date: "15 Feb 2025", title: "Annual Day Celebration — Grand cultural program by students" },
                { date: "31 Mar 2025", title: "Admissions Open for 2025-26 — Apply before the deadline" },
                { date: "NEW", title: "Board Exam Results — Class 10 & 12 | 99% pass rate achieved!" },
                { date: "25 Jan 2025", title: "Sports Day — Inter-house competition and prize distribution" },
                { date: "26 Jan 2025", title: "Holiday Notice — School closed on Republic Day" },
              ].map((notice, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded shadow-md relative hover:-rotate-1 transition-transform duration-200 cursor-default"
                  style={{ backgroundColor: "#FFF8F0" }}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-red-600 drop-shadow-md">
                    <Pin size={24} fill="currentColor" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center pt-2">
                    <span className="text-white text-xs font-bold px-2 py-1 rounded shrink-0" style={{ backgroundColor: "#D4A017" }}>{notice.date}</span>
                    <span className="font-bold text-foreground">{notice.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. PRINCIPAL'S MESSAGE */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div
              className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden shrink-0 shadow-2xl relative flex items-center justify-center"
              style={{ border: "8px solid #D4A017", backgroundColor: "#700000" }}
            >
              <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to top right, rgba(0,0,0,0.4), transparent)" }} />
              <svg viewBox="0 0 24 24" className="w-32 h-32 opacity-40" fill="#D4A017">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>

            <div>
              <h2 className="text-4xl font-serif font-bold mb-6" style={{ color: "#D4A017" }}>Message from the Principal</h2>
              <div className="space-y-4 text-lg font-light leading-relaxed mb-8 text-white/90">
                <p>
                  &ldquo;At Hindu Girls Senior Secondary School, we believe that educating a girl is educating an entire generation. For over 50 years, our institution has stood as a pillar of academic rigor deeply intertwined with traditional Indian values.&rdquo;
                </p>
                <p>
                  &ldquo;We strive to provide a safe, nurturing environment where every young woman can discover her potential, develop moral courage, and acquire the skills necessary to navigate and lead in a rapidly changing world.&rdquo;
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-white">Mrs. [Principal Name], M.Ed., Ph.D.</p>
                <p className="font-semibold uppercase tracking-wider text-sm mt-1" style={{ color: "#FF6B00" }}>Principal, HGSS</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. GALLERY */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">Campus Life</h2>
            <div className="w-24 h-1 mx-auto" style={{ backgroundColor: "#D4A017" }} />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {[
              { img: galleryBuilding, caption: "Heritage Campus Building" },
              { img: galleryClassroom, caption: "Modern Classrooms" },
              { img: galleryLibrary, caption: "Extensive Library" },
              { img: gallerySports, caption: "Annual Sports Meet" },
              { img: galleryAnnualFunction, caption: "Cultural Celebrations" },
              { img: galleryScienceLab, caption: "Advanced Laboratories" },
            ].map((item, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-sm bg-muted" style={{ aspectRatio: "4/3" }}>
                <img
                  src={item.img}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end" style={{ background: "linear-gradient(to top, rgba(139,0,0,0.9) 0%, rgba(139,0,0,0.2) 60%, transparent 100%)" }}>
                  <div className="p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-serif font-bold text-xl">{item.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. ADMISSION SECTION */}
      <section id="admissions" className="py-24 border-y" style={{ backgroundColor: "#FFF8F0", borderColor: "#e2d1c3" }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold text-primary mb-16">Admission Process</h2>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-0 max-w-5xl mx-auto mb-16 relative">
            <div className="hidden md:block absolute top-8 left-10 right-10 h-1 bg-primary/20 z-0" />
            {[
              { step: 1, icon: <Monitor />, title: "Apply Online", desc: "Fill the application form with student details" },
              { step: 2, icon: <FileText />, title: "Submit Documents", desc: "Upload birth certificate, marksheets & photo" },
              { step: 3, icon: <Sparkles />, title: "Verification", desc: "School reviews the application and documents" },
              { step: 4, icon: <CheckCircle2 />, title: "Confirmed!", desc: "Welcome to the HGSS family!" },
            ].map((step, idx, arr) => (
              <div key={idx} className="relative z-10 flex-1 flex flex-col items-center group w-full md:w-auto cursor-default">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-primary flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors relative">
                  {step.icon}
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#D4A017" }}
                  >
                    {step.step}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                <p className="text-sm text-foreground/70 max-w-xs">{step.desc}</p>
                {idx !== arr.length - 1 && <ChevronRight className="md:hidden text-primary/30 mt-4" />}
              </div>
            ))}
          </div>

          <Button
            size="lg"
            className="text-white text-lg px-10 py-6 rounded-sm"
            style={{ backgroundColor: "#FF6B00" }}
            onClick={() => scrollToSection("contact")}
          >
            Start Your Application
          </Button>
        </div>
      </section>

      {/* 13. CONTACT FORM */}
      <section id="contact" className="py-24 bg-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(#FF6B00 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto shadow-xl border overflow-hidden rounded-sm" style={{ backgroundColor: "#FFF8F0", borderColor: "#e2d1c3" }}>
            <div className="grid md:grid-cols-2">

              {/* Form */}
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-serif font-bold text-primary mb-6">Get in Touch</h2>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  {[
                    { label: "Full Name", type: "text", placeholder: "Enter your name" },
                    { label: "Phone Number", type: "tel", placeholder: "+91 XXXXXXXXXX" },
                    { label: "Email", type: "email", placeholder: "your@email.com" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-sm font-semibold mb-1 text-foreground/80">{field.label}</label>
                      <input
                        type={field.type}
                        className="w-full border-b-2 border-primary/20 bg-transparent py-2 focus:border-primary outline-none transition-colors"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-foreground/80">Class Interested</label>
                    <select className="w-full border-b-2 border-primary/20 bg-transparent py-2 focus:border-primary outline-none transition-colors">
                      <option value="">Select a class...</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>Class {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-foreground/80">Message</label>
                    <textarea
                      rows={3}
                      className="w-full border-b-2 border-primary/20 bg-transparent py-2 focus:border-primary outline-none transition-colors resize-none"
                      placeholder="How can we help?"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-white mt-4 rounded-sm py-6 text-lg bg-primary hover:bg-primary/90"
                  >
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="bg-primary p-8 md:p-12 relative overflow-hidden">
                <div
                  className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl"
                  style={{ backgroundColor: "rgba(255,107,0,0.2)" }}
                />
                <h2 className="text-3xl font-serif font-bold mb-8" style={{ color: "#D4A017" }}>Contact Info</h2>

                <div className="space-y-6 relative z-10">
                  {[
                    {
                      icon: <MapPin style={{ color: "#FF6B00" }} className="shrink-0 mt-1" />,
                      label: "Address",
                      content: "[School Address Line 1]\n[City, State, Pincode]",
                    },
                    {
                      icon: <Phone style={{ color: "#FF6B00" }} className="shrink-0 mt-1" />,
                      label: "Phone",
                      content: "+91-XXXXXXXXXX\n+91-XXXXXXXXXX",
                    },
                    {
                      icon: <Mail style={{ color: "#FF6B00" }} className="shrink-0 mt-1" />,
                      label: "Email",
                      content: "info@hgsschool.edu.in\nadmissions@hgsschool.edu.in",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4 text-white/80">
                      {item.icon}
                      <div>
                        <h4 className="font-bold text-white mb-1">{item.label}</h4>
                        <p className="whitespace-pre-line text-sm">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 w-full h-48 rounded-sm flex items-center justify-center border border-white/10 backdrop-blur-sm relative z-10 bg-black/20">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 text-white/50" />
                    <span className="text-white/50 font-medium text-sm">Map Integration Placeholder</span>
                  </div>
                </div>

                <div className="mt-8 relative z-10">
                  <p className="text-white/70 text-sm font-medium">Working Hours</p>
                  <p className="text-white text-sm mt-1">Monday – Saturday: 8:00 AM – 2:30 PM</p>
                  <p className="text-white/70 text-sm mt-1">Office: 9:00 AM – 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. FOOTER */}
      <footer style={{ backgroundColor: "#5c0000", color: "#FFF8F0" }} className="pt-16">
        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shrink-0" style={{ backgroundColor: "#D4A017" }}>
                  <span>🏫</span>
                </div>
                <span className="font-serif font-bold text-xl leading-tight">Hindu Girls<br />Senior Secondary</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Empowering generations of young women since 1974 with deep-rooted values and academic excellence.
              </p>
              <div className="flex gap-3 mt-6">
                {[<Facebook size={18} />, <Twitter size={18} />, <Instagram size={18} />, <Youtube size={18} />].map((icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 rounded-full flex items-center justify-center border border-white/20 hover:border-yellow-400 hover:text-yellow-400 transition-colors"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-serif font-bold text-lg mb-6 pb-2 inline-block border-b border-white/20">Quick Links</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-white/70 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2"
                    >
                      <ChevronRight size={14} /> {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-serif font-bold text-lg mb-6 pb-2 inline-block border-b border-white/20">Contact Us</h4>
              <ul className="space-y-4 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="mt-1 shrink-0" style={{ color: "#D4A017" }} />
                  <span>[School Address], [City]</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0" style={{ color: "#D4A017" }} />
                  <span>+91-XXXXXXXXXX</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0" style={{ color: "#D4A017" }} />
                  <span>info@hgsschool.edu.in</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-serif font-bold text-lg mb-6 pb-2 inline-block border-b border-white/20">Newsletter</h4>
              <p className="text-white/70 text-sm mb-4">Subscribe to receive important updates and school news.</p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-white/10 border border-white/20 px-4 py-2 text-sm outline-none transition-colors rounded-l-sm"
                />
                <button
                  type="submit"
                  className="px-4 font-bold text-sm transition-colors rounded-r-sm text-primary"
                  style={{ backgroundColor: "#D4A017" }}
                >
                  Go
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 text-center text-xs" style={{ backgroundColor: "#3a0000", color: "rgba(255,255,255,0.5)" }}>
          <div className="container mx-auto px-4">
            <p>&copy; {new Date().getFullYear()} Hindu Girls Senior Secondary School. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
