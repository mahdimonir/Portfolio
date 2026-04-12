"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { 
  FaUpload, 
  FaDownload, 
  FaTrash, 
  FaLayerGroup, 
  FaColumns, 
  FaThLarge, 
  FaFeatherAlt,
  FaMagic,
  FaRedoAlt
} from "react-icons/fa";
import { toPng } from "html-to-image";
import { toast } from "sonner";

const TEMPLATES = [
  {
    id: "digimax",
    name: "Digimax Style",
    icon: FaLayerGroup,
    description: "Tilted 3D cards with perspective",
    config: {
      perspective: "perspective-1000",
      containerStyle: "rotateX(15deg) rotateY(-15deg) rotateZ(10deg)",
      itemStyles: [
        "translateZ(50px) scale(0.9)",
        "translateZ(100px) rotate(-5deg) translate(-20px, 20px)",
        "translateZ(150px) rotate(5deg) translate(30px, -20px)",
        "translateZ(200px) scale(1.1) translate(0, 40px)",
      ]
    }
  },
  {
    id: "glass-stack",
    name: "Glass Stack",
    icon: FaColumns,
    description: "Vertical stacked glass cards",
    config: {
      perspective: "",
      containerStyle: "",
      itemStyles: [
        "translateY(0) scale(1) z-10",
        "translateY(40px) scale(0.95) opacity-80 z-20",
        "translateY(80px) scale(0.9) opacity-60 z-30",
        "translateY(120px) scale(0.85) opacity-40 z-40",
      ]
    }
  },
  {
    id: "modern-grid",
    name: "Modern Grid",
    icon: FaThLarge,
    description: "Sleek glowing grid layout",
    config: {
      perspective: "",
      containerStyle: "",
      itemStyles: [
        "rotate(-2deg)",
        "rotate(2deg)",
        "rotate(-1deg)",
        "rotate(1deg)",
      ]
    }
  },
  {
    id: "floating-focus",
    name: "Floating Focus",
    icon: FaMagic,
    description: "One main focus with variants",
    config: {
      perspective: "perspective-1000",
      containerStyle: "rotateY(-10deg)",
      itemStyles: [
        "scale(1.2) z-30",
        "scale(0.8) translate(-100px, -50px) rotate(-10deg) opacity-50 z-10",
        "scale(0.8) translate(100px, 50px) rotate(10deg) opacity-50 z-10",
        "scale(0.6) translate(0, -100px) opacity-30 z-0",
      ]
    }
  }
];

const MockupDesigner = () => {
  const [images, setImages] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [title, setTitle] = useState("Project Name");
  const [subtitle, setSubtitle] = useState("Premium UX/UI Design Solution");
  const [badgeText, setBadgeText] = useState("Build Stunning Apps!");
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      toast.error("Maximum 4 images allowed for templates.");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownload = async () => {
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    setIsExporting(true);
    toast.info("Generating your premium mockup...");

    try {
      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High resolution
        quality: 1,
      });
      
      const link = document.createElement("a");
      link.download = `mockup-${title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Mockup downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate mockup image.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-100px)] animate-in fade-in duration-700">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        <div className="glass-premium p-6 rounded-3xl space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaFeatherAlt className="text-blue-500" />
              Content Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="App Name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subtitle</label>
                <input 
                  type="text" 
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Description..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Badge Text</label>
                <input 
                  type="text" 
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Call to Action"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaLayerGroup className="text-purple-500" />
              Templates
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${
                    selectedTemplate.id === tpl.id 
                    ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20" 
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                  }`}
                >
                  <tpl.icon size={20} className={selectedTemplate.id === tpl.id ? "" : "group-hover:text-blue-400"} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{tpl.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaUpload className="text-green-500" />
              Images ({images.length}/4)
            </h2>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {images.map((img, i) => (
                <div key={i} className="relative group aspect-[9/16] rounded-lg overflow-hidden border border-white/10">
                  <img src={img} alt="upload" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-red-500/80 items-center justify-center hidden group-hover:flex transition-all"
                  >
                    <FaTrash className="text-white" />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="aspect-[9/16] border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all text-gray-500 hover:text-blue-400">
                  <input type="file" className="hidden" multiple onChange={handleImageUpload} accept="image/*" />
                  <FaUpload />
                </label>
              )}
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={isExporting || images.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isExporting ? <FaRedoAlt className="animate-spin" /> : <FaDownload />}
            {isExporting ? "Exporting..." : "Download High-Res Mockup"}
          </button>
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="flex-1 flex items-center justify-center bg-gray-100/50 dark:bg-black/50 rounded-[40px] p-4 md:p-12 overflow-hidden border border-gray-200 dark:border-white/5">
        <div 
          ref={canvasRef}
          className="relative w-full aspect-[16/10] max-w-4xl mesh-gradient-premium rounded-[32px] overflow-hidden shadow-2xl flex items-center justify-center p-8 md:p-16"
        >
          {/* Background Elements */}
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[100px] rounded-full" />
          
          {/* Content Wrapper */}
          <div className="relative w-full h-full flex flex-col md:flex-row items-center gap-12">
            
            {/* Left Side: Text */}
            <div className="flex-1 text-center md:text-left z-50">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                key={`title-${title}`}
                className="space-y-4"
              >
                <h1 className="text-4xl md:text-7xl font-black text-white leading-tight">
                  {title.split(' ')[0]} <br/>
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {title.split(' ').slice(1).join(' ')}
                  </span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl font-medium max-w-md">
                  {subtitle}
                </p>
                
                <div className="pt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="glass-premium px-6 py-2 rounded-full flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center italic font-black text-[10px] text-white">DZ</div>
                    <span className="text-white font-bold text-sm tracking-tight">{badgeText}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side: Mockup Images */}
            <div className={`flex-1 relative h-full flex items-center justify-center ${selectedTemplate.config.perspective}`}>
              <div 
                className="relative w-full h-full flex items-center justify-center preserve-3d"
                style={{ transform: selectedTemplate.config.containerStyle }}
              >
                <AnimatePresence mode="popLayout">
                  {images.length > 0 ? (
                    images.map((img, idx) => (
                      <motion.div
                        key={`${selectedTemplate.id}-img-${idx}`}
                        initial={{ opacity: 0, scale: 0.5, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                        className="absolute w-[60%] md:w-[70%] aspect-[9/16] glass-premium rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20"
                        style={{ 
                          transform: selectedTemplate.config.itemStyles[idx] || "",
                          zIndex: 10 + idx
                        }}
                      >
                        <img src={img} className="w-full h-full object-cover" alt={`step ${idx}`} />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-gray-500 opacity-20">
                      <FaLayerGroup size={80} />
                      <p className="font-bold uppercase tracking-widest text-sm">Preview Appearance</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>

          {/* Decorative Sparkles */}
          <div className="absolute top-[15%] left-[45%] text-white/40 animate-pulse"><FaMagic size={20} /></div>
          <div className="absolute bottom-[20%] right-[30%] text-white/20 animate-float"><FaMagic size={12} /></div>
        </div>
      </div>
    </div>
  );
};

export default MockupDesigner;
