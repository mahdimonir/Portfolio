"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { 
  FaUpload, 
  FaDownload, 
  FaTrash, 
  FaLayerGroup, 
  FaColumns, 
  FaThLarge, 
  FaFeatherAlt,
  FaMagic,
  FaRedoAlt,
  FaMobileAlt,
  FaDesktop,
  FaImages,
  FaExchangeAlt
} from "react-icons/fa";
import { toPng } from "html-to-image";
import { toast } from "sonner";

const TEMPLATES = [
  {
    id: "digimax",
    name: "Digimax Style",
    icon: FaLayerGroup,
    config: {
      perspective: "perspective-[2000px]",
      containerStyle: "rotateX(10deg) rotateY(-15deg) rotateZ(5deg)",
    }
  },
  {
    id: "glass-stack",
    name: "Glass Stack",
    icon: FaColumns,
    config: {
      perspective: "",
      containerStyle: "",
    }
  },
  {
    id: "modern-grid",
    name: "Modern Grid",
    icon: FaThLarge,
    config: {
      perspective: "",
      containerStyle: "",
    }
  },
  {
    id: "floating-focus",
    name: "Floating Focus",
    icon: FaMagic,
    config: {
      perspective: "perspective-[1500px]",
      containerStyle: "rotateY(-10deg)",
    }
  }
];

const MockupDesigner = () => {
  const [images, setImages] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [title, setTitle] = useState("Digimax.");
  const [subtitle, setSubtitle] = useState("SEO & Digital Marketing HTML Template");
  const [badgeText, setBadgeText] = useState("Build a stunning website in no time!");
  const [badgeIcon, setBadgeIcon] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      toast.error("Maximum 4 images allowed.");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: reader.result,
          type: "mobile"
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const toggleImageType = (id) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, type: img.type === "mobile" ? "desktop" : "mobile" } : img
    ));
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleBadgeIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBadgeIcon(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    setIsExporting(true);
    toast.info("Generating your premium composition...");

    try {
      // Ensure specific quality settings
      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        pixelRatio: 3, // Even higher resolution for ultimate quality
        quality: 1,
        backgroundColor: '#0f172a'
      });
      
      const link = document.createElement("a");
      link.download = `mockup-${title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Download ready!");
    } catch (err) {
      console.error(err);
      toast.error("Generation failed.");
    } finally {
      setIsExporting(false);
    }
  };

  // Dynamic layout logic based on image count and template
  const getItemVariants = (idx, total, templateId, imgType) => {
    const isDesktop = imgType === "desktop";
    
    // Base scales
    let scale = 1;
    if (total === 1) scale = 1.6;
    else if (total === 2) scale = 1.3;
    else if (total === 3) scale = 1.1;

    // Template specific offsets
    if (templateId === "digimax") {
      const positions = [
        { x: total === 1 ? 0 : -60, y: total === 1 ? 0 : -40, z: 100, rotateZ: total === 1 ? 0 : -5 },
        { x: 50, y: 30, z: 250, rotateZ: 5 },
        { x: -30, y: 100, z: 400, rotateZ: -2 },
        { x: 80, y: -80, z: 150, rotateZ: 10 },
      ];
      const pos = positions[idx] || positions[0];
      return {
        animate: { 
          opacity: 1, x: pos.x, y: pos.y, translateZ: pos.z, rotateZ: pos.rotateZ, scale: scale * (isDesktop ? 0.9 : 1)
        }
      };
    }

    if (templateId === "glass-stack") {
      const offset = 50;
      return {
        animate: { 
          opacity: 1, x: idx * offset, y: idx * offset, translateZ: idx * 10, rotateZ: 0, scale: scale * 0.9
        }
      };
    }

    if (templateId === "modern-grid") {
        const gridPos = [
            { x: -120, y: -100 }, { x: 120, y: -100 },
            { x: -120, y: 100 }, { x: 120, y: 100 }
        ];
        const pos = total === 1 ? { x: 0, y: 0 } : gridPos[idx] || { x: 0, y: 0 };
        return {
          animate: { 
            opacity: 1, x: pos.x, y: pos.y, translateZ: 0, rotateZ: idx % 2 === 0 ? -2 : 2, scale: scale * 0.8
          }
        };
    }

    if (templateId === "floating-focus") {
      const focusScales = [1.2, 0.7, 0.7, 0.5];
      const focusPos = [
        { x: 0, y: 0, z: 100 },
        { x: -200, y: -120, z: 0 },
        { x: 200, y: 120, z: 0 },
        { x: 0, y: -180, z: -50 }
      ];
      const pos = focusPos[idx] || focusPos[0];
      return {
        animate: { 
          opacity: 1, x: pos.x, y: pos.y, translateZ: pos.z, rotateZ: idx === 0 ? 0 : (idx % 2 === 0 ? 10 : -10), scale: (focusScales[idx] || 0.5) * scale * 0.8
        }
      };
    }

    return { animate: { opacity: 1, scale } };
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 min-h-[calc(100vh-100px)] p-4 max-w-[1800px] mx-auto">
      {/* Sidebar Controls */}
      <div className="w-full xl:w-[420px] flex flex-col gap-6 overflow-y-auto max-h-[85vh] pr-4 custom-scrollbar">
        <div className="glass-premium p-6 rounded-[32px] space-y-8">
          {/* Header Info */}
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-blue-500/80 flex items-center gap-2">
              <FaFeatherAlt /> Text Content
            </h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Main Brand/App Name</p>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-lg"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Marketing Subtitle</p>
                <textarea 
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium h-24 resize-none leading-relaxed"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Badge Description</p>
                <input 
                  type="text" 
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Badge Icon Customization */}
          <div className="space-y-4">
               <h2 className="text-sm font-black uppercase tracking-widest text-orange-500/80 flex items-center gap-2">
                  <FaMagic /> Badge Visuals
               </h2>
               <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center p-2.5 shadow-lg shadow-orange-500/20">
                      {badgeIcon ? <img src={badgeIcon} className="w-full h-full object-contain" alt="badge" /> : <FaMagic className="text-white" />}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white uppercase tracking-tight">Custom Badge Icon</p>
                      <p className="text-[10px] text-gray-400">{badgeIcon ? "Replace current icon" : "Upload your logo/icon"}</p>
                    </div>
                  </div>
                  <FaUpload className="text-gray-500 group-hover:text-white transition-colors" />
                  <input type="file" className="hidden" onChange={handleBadgeIconUpload} accept="image/*" />
               </label>
          </div>

          {/* Style Selector */}
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-purple-500/80 flex items-center gap-2">
              <FaImages /> Composition Style
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-3 group transition-all transform active:scale-95 ${
                    selectedTemplate.id === tpl.id 
                    ? "bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-400 text-white shadow-xl shadow-blue-500/20" 
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <tpl.icon size={24} className={selectedTemplate.id === tpl.id ? "text-white" : "group-hover:text-blue-400 transition-colors"} />
                  <span className="text-[10px] font-black uppercase tracking-[0.1em]">{tpl.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Image List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-green-500/80 flex items-center gap-2">
                <FaUpload /> Media Stack ({images.length}/4)
              </h2>
            </div>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {images.map((img, i) => (
                  <motion.div 
                    key={img.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0">
                      <img src={img.url} alt="upload" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Device Layout</p>
                        <div className="flex bg-black/30 p-1 rounded-lg w-fit">
                            <button 
                                onClick={() => toggleImageType(img.id)}
                                className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all ${img.type === "mobile" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                            >
                                <FaMobileAlt size={10} /> <span className="text-[9px] font-black uppercase">Mobile</span>
                            </button>
                            <button 
                                onClick={() => toggleImageType(img.id)}
                                className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all ${img.type === "desktop" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                            >
                                <FaDesktop size={10} /> <span className="text-[9px] font-black uppercase">Desktop</span>
                            </button>
                        </div>
                    </div>
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="p-3 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <FaTrash size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {images.length < 4 && (
                <label className="w-full py-10 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-blue-500/50 transition-all text-gray-500 group">
                  <FaUpload size={24} className="mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Add Screenshot</p>
                  <input type="file" className="hidden" multiple onChange={handleImageUpload} accept="image/*" />
                </label>
              )}
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={isExporting || images.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black h-16 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:translate-y-[-2px] uppercase tracking-widest"
          >
            {isExporting ? <FaRedoAlt className="animate-spin text-xl" /> : <FaDownload className="text-xl" />}
            {isExporting ? "Rendering Design..." : "Export Composition"}
          </button>
        </div>
      </div>

      {/* Canvas Preview Area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30 dark:bg-black/40 rounded-[64px] p-8 lg:p-16 border border-gray-200 dark:border-white/5 shadow-inner min-h-[500px]">
        <div 
          ref={canvasRef}
          className="relative w-full aspect-[16/10] max-h-[75vh] mesh-gradient-premium rounded-[48px] overflow-hidden shadow-[0_50px_120px_-20px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-700"
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-blue-500/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-purple-500/20 blur-[120px] rounded-full" />
          </div>

          {/* Master Layout */}
          <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-between px-16 lg:px-24 gap-20 z-20">
            
            {/* Branding Column */}
            <div className="w-full md:w-[45%] text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                key={title + subtitle}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h1 className="text-6xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85] drop-shadow-2xl">
                    {title}
                  </h1>
                  <p className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-white via-white to-white/30 bg-clip-text text-transparent opacity-90 leading-[1.1] max-w-lg">
                    {subtitle}
                  </p>
                </div>

                <div className="flex justify-center md:justify-start">
                  <div className="glass-premium px-8 py-4 rounded-[24px] flex items-center gap-5 border-white/20">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-400 to-orange-500 shadow-xl shadow-orange-500/30 flex items-center justify-center p-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 blur-xl scale-150 animate-pulse pointer-events-none" />
                      {badgeIcon ? (
                        <img src={badgeIcon} className="w-full h-full object-contain relative z-10" alt="badge" />
                      ) : (
                        <FaMagic className="text-white relative z-10" />
                      )}
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-blue-400 uppercase tracking-[0.2em] leading-none mb-1.5">Official Badge</p>
                      <p className="text-white font-black text-base lg:text-lg leading-tight max-w-[200px] tracking-tight">{badgeText}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Showcase Column */}
            <div className={`w-full md:w-[55%] h-full flex items-center justify-center ${selectedTemplate.config.perspective}`}>
              <motion.div 
                className="relative w-full aspect-square flex items-center justify-center preserve-3d"
                animate={{ transform: selectedTemplate.config.containerStyle }}
                transition={{ type: "spring", stiffness: 40, damping: 20 }}
              >
                <AnimatePresence mode="popLayout">
                  {images.length > 0 ? (
                    images.map((img, idx) => {
                      const variants = getItemVariants(idx, images.length, selectedTemplate.id, img.type);
                      return (
                        <motion.div
                          key={img.id}
                          layout
                          initial={{ opacity: 0, scale: 0.2, translateZ: -200 }}
                          animate={variants.animate}
                          exit={{ opacity: 0, scale: 0.5, translateZ: 400 }}
                          transition={{ 
                            delay: idx * 0.1, 
                            type: "spring", 
                            stiffness: 60, 
                            damping: 18,
                            layout: { duration: 0.5 }
                          }}
                          className={`absolute glass-premium rounded-[32px] overflow-hidden shadow-[0_45px_100px_-25px_rgba(0,0,0,0.6)] border-[4px] border-white/25 ${img.type === "mobile" ? "w-[50%] aspect-[9/16]" : "w-[90%] aspect-[16/10]"}`}
                          style={{ zIndex: 100 - idx }}
                        >
                          <img src={img.url} className="w-full h-full object-contain bg-black/40" alt={`showcase-${idx}`} />
                          {/* Premium Overlay Reflection */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/15 pointer-events-none" />
                        </motion.div>
                      );
                    })
                  ) : (
                    <motion.div 
                       initial={{ opacity: 0 }} 
                       animate={{ opacity: 0.05 }} 
                       className="flex flex-col items-center gap-8 text-white"
                    >
                      <FaImages size={160} />
                      <p className="font-black uppercase tracking-[0.5em] text-2xl">Perspective Stack</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

          </div>

          {/* Clean output - no floating icons or text here for the capture */}
        </div>
      </div>
    </div>
  );
};

export default MockupDesigner;
