"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WatermarkedImage from "@/components/ui/WatermarkedImage";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "@/components/ui/Modal";

export interface VehicleGalleryProps {
  images: string[];
  alt: string;
}

export default function VehicleGallery({ images, alt }: VehicleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-dark-800 cursor-pointer group">
          <WatermarkedImage
            src={images[selectedIndex]}
            alt={`${alt} - Image ${selectedIndex + 1}`}
            fill
            className="group-hover:scale-105 transition-transform duration-500"
            onClick={() => setIsModalOpen(true)}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedIndex === index
                  ? "border-cyan-500 scale-105"
                  : "border-transparent hover:border-white/20"
                  }`}
              >
                <WatermarkedImage
                  src={image}
                  alt={`${alt} - Thumbnail ${index + 1}`}
                  fill
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full Screen Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="full"
      >
        <div className="relative h-[80vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full"
            >
              <WatermarkedImage
                src={images[selectedIndex]}
                alt={`${alt} - Full size view ${selectedIndex + 1}`}
                fill
              />
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      </Modal>
    </>
  );
}
