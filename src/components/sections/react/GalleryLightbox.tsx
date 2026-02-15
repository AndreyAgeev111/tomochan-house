import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

interface GalleryLightboxProps {
  images: GalleryImage[];
}

export default function GalleryLightbox({ images }: GalleryLightboxProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <>
      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map((image, i) => (
          <button
            key={image.id}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="group cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-DEFAULT rounded-lg"
          >
            <div className="relative rounded-lg overflow-hidden aspect-square shadow-softer hover:shadow-lg transition-shadow duration-300">
              <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-semibold text-sm">{image.caption}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden">
        <div className="overflow-x-auto scrollbar-hide pb-4">
          <div className="flex gap-3 snap-x snap-mandatory" style={{ width: "fit-content" }}>
            {images.map((image, i) => (
              <button
                key={image.id}
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
                className="flex-shrink-0 w-72 snap-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-DEFAULT rounded-lg"
              >
                <div className="relative rounded-lg overflow-hidden aspect-square shadow-soft">
                  <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white font-semibold text-sm">{image.caption}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <p className="text-center text-xs text-warm-700 mt-2">← スワイプして閲覧 →</p>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={open}
        index={index}
        close={() => setOpen(false)}
        slides={images.map((img) => ({
          src: img.src,
          alt: img.alt,
        }))}
        on={{
          view: ({ index: currentIndex }) => setIndex(currentIndex),
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
        }}
      />
    </>
  );
}
