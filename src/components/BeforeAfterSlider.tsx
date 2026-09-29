'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, ArrowLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  subtitle?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage = '/beautyImages/3.jpg',
  afterImage = '/beautyImages/1.jpg',
  beforeLabel = 'Before: Climate Dehydration & Barrier Fatigue',
  afterLabel = 'After: 72H Deep Botanical Moisture Barrier',
  title = 'Documented Clinical Barrier Transformation',
  subtitle = 'Drag the slider to observe real visible texture softening and lit-from-within melanin radiance.',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percent = (clampedX / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <section className="py-16 bg-[#F5F9FE] border-y border-[#E5E7EB]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-[#DCEBFA] text-[#0B1F3A] px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-mono font-semibold mb-3">
            <Sparkles className="w-3 h-3 text-[#174EA6]" />
            Clinical Verification & Results
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl text-[#0B1F3A]">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-2 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Interactive Comparison Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden select-none cursor-ew-resize border border-[#0B1F3A]/20 shadow-lg bg-[#0B1F3A]"
        >
          {/* After Image (Full Background) */}
          <img
            src={afterImage}
            alt="After Botanical Care"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* After Badge */}
          <div className="absolute top-4 right-4 bg-[#0B1F3A]/90 backdrop-blur-xs text-[#DCEBFA] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] font-semibold z-10 border border-white/20">
            {afterLabel}
          </div>

          {/* Before Image (Clipped Overlay) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={beforeImage}
              alt="Before Botanical Care"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                maxWidth: 'none',
              }}
            />
          </div>

          {/* Before Badge */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[#0B1F3A] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] font-semibold z-10 border border-[#E5E7EB] shadow-xs">
            {beforeLabel}
          </div>

          {/* Vertical Divider Line with Luxury Handle */}
          <div
            className="absolute top-0 bottom-0 z-20"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            {/* Dividing Line */}
            <div className="w-[2.5px] h-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]" />

            {/* Circular Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#0B1F3A] text-white border-2 border-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform cursor-ew-resize">
              <ArrowLeftRight className="w-4 h-4 text-[#DCEBFA]" />
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-4 text-center">
          <span className="text-[11px] text-[#6B7280] font-sans">
            Touch or drag the slider left and right to inspect the hydration transition.
          </span>
        </div>
      </div>
    </section>
  );
};
