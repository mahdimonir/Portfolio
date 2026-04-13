"use client";

import { toPng } from "html-to-image";
import { useCallback, useRef, useState } from "react";

const MockupDesigner = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("RoktoLagbe.");
  const [subtitle, setSubtitle] = useState("Blood Donation Platform");
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef(null);

  const handleUpload = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 4) return alert("Max 4 images");
    files.forEach((f) => {
      const r = new FileReader();
      r.onload = (ev) =>
        setImages((prev) => [
          ...prev,
          { id: Date.now() + Math.random(), url: ev.target.result, name: f.name },
        ]);
      r.readAsDataURL(f);
    });
    e.target.value = "";
  }, [images]);

  const removeImg = (id) => setImages((p) => p.filter((i) => i.id !== id));

  const handleDownload = async () => {
    if (!images.length || !canvasRef.current) return;
    setIsExporting(true);

    const canvas = canvasRef.current;
    const originalStyle = canvas.getAttribute("style");

    try {
      canvas.style.width = "1140px";
      canvas.style.height = "641px"; 
      canvas.style.maxWidth = "none";
      canvas.style.aspectRatio = "auto";

      const url = await toPng(canvas, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#060d1a",
      });

      const a = document.createElement("a");
      a.href = url;
      a.download = `mockup-${title.replace(/\s+/g, "-").toLowerCase()}.png`;
      a.click();
    } catch (e) {
      alert("Export failed: " + e.message);
    } finally {
      if (originalStyle) canvas.setAttribute("style", originalStyle);
      setIsExporting(false);
    }
  };

  const words = title.trim().split(/\s+/);
  const mainWords = words.slice(0, -1).join(" ");
  const accentWord = words[words.length - 1];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#060d1a",
        fontFamily: "'Outfit', 'Inter', sans-serif",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: 286,
          flexShrink: 0,
          background: "#0a1120",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          padding: "28px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 22,
          overflowY: "auto",
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "#6366f1",
            textTransform: "uppercase",
          }}
        >
          ✦ Mockup Designer
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={sL}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} style={sI} />
          </div>
          <div>
            <label style={sL}>Subtitle</label>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={sI} />
          </div>
        </div>

        <div>
          <label style={sL}>Screenshots ({images.length}/4)</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
            {images.map((img) => (
              <div
                key={img.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 8,
                  padding: "7px 10px",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <img
                  src={img.url}
                  alt=""
                  style={{ width: 50, height: 34, objectFit: "cover", borderRadius: 4, flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7a99",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {img.name}
                </span>
                <button
                  onClick={() => removeImg(img.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#445",
                    cursor: "pointer",
                    fontSize: 18,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {images.length < 4 && (
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                padding: "18px 0",
                border: "1.5px dashed rgba(99,102,241,0.3)",
                borderRadius: 10,
                cursor: "pointer",
                color: "#6366f1",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              <span style={{ fontSize: 20 }}>↑</span> Upload Screenshot
              <input type="file" accept="image/*" multiple hidden onChange={handleUpload} />
            </label>
          )}
        </div>

        <button
          onClick={handleDownload}
          disabled={isExporting || !images.length}
          style={{
            marginTop: "auto",
            padding: "14px 0",
            background: !images.length
              ? "rgba(99,102,241,0.12)"
              : "linear-gradient(135deg,#6366f1,#7c3aed)",
            border: "none",
            borderRadius: 12,
            color: !images.length ? "#334" : "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: !images.length ? "not-allowed" : "pointer",
          }}
        >
          {isExporting ? "Exporting..." : "⬇ Download PNG"}
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div
          ref={canvasRef}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 1140,
            aspectRatio: "16/9",
            background: "#0a0e17",
            borderRadius: 24,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 70% 30%, rgba(99,102,241,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "12%",
              textAlign: "left",
              zIndex: 10,
              maxWidth: "40%",
            }}
          >
            <div style={{ lineHeight: 1.2, marginBottom: 6 }}>
              {mainWords && (
                <span
                  style={{
                    fontSize: "clamp(20px, 2.5vw, 30px)",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    color: "#fff",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {mainWords}{" "}
                </span>
              )}
              <span
                style={{
                  fontSize: "clamp(20px, 2.5vw, 30px)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "#818cf8",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {accentWord}
              </span>
            </div>
            <div
              style={{
                fontSize: "clamp(10px, 1vw, 13px)",
                fontWeight: 400,
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.5px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {subtitle}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "8%",
              position: "relative",
              zIndex: 5,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px",
                width: "65%",
                maxWidth: "680px",
                transform: "rotate(-10deg)",
                transformOrigin: "center center",
                transition: "all 0.3s ease",
              }}
            >
              {images.length === 0 ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    color: "rgba(255,255,255,0.1)",
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "40px",
                    border: "2px dashed rgba(255,255,255,0.1)",
                    borderRadius: 16,
                  }}
                >
                  Upload 4 Screenshots
                </div>
              ) : (
                images.map((img, idx) => (
                  <div
                    key={img.id}
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "#1a2540",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
                      opacity: 1,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        height: 24,
                        background: "#0e1928",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "0 10px",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
                    </div>
                    <img
                      src={img.url}
                      alt=""
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const sL = {
  display: "block",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#6366f1",
  marginBottom: 6,
};

const sI = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 8,
  padding: "9px 12px",
  color: "#fff",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
};

export default MockupDesigner;