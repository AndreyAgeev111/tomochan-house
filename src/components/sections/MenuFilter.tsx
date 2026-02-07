import React, { useState } from "react";
import { motion } from "framer-motion";
import { siteContent } from "../../content/siteContent";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function MenuFilter() {
  const { menu } = siteContent;
  const [activeCategory, setActiveCategory] = useState(menu.categories[0]);

  const filteredItems = menu.items.filter((item) => item.category === activeCategory);

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex justify-center gap-2 md:gap-3 mb-8 md:mb-12 flex-wrap px-2">
        {menu.categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 md:px-6 py-1 md:py-2 rounded-full font-bold transition-all duration-300 text-sm md:text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-DEFAULT ${
              activeCategory === category
                ? "bg-accent-DEFAULT text-warm-900 shadow-soft md:scale-105"
                : "bg-warm-100 text-warm-700 hover:bg-warm-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={activeCategory}
      >
        {filteredItems.map((item) => (
          <motion.div
            key={item.name}
            className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-softer hover:shadow-soft transition-shadow border border-warm-100"
            variants={itemVariants}
          >
            <div className="flex items-start gap-3 md:gap-4">
              <span className="text-2xl md:text-3xl flex-shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-warm-900 text-base md:text-lg mb-1 md:mb-2 break-words">
                  {item.name}
                </h4>
                <p className="text-xs md:text-sm text-warm-700 mb-2 md:mb-3 line-clamp-2">
                  {item.description}
                </p>
                <p className="font-bold text-accent-DEFAULT text-sm md:text-base">{item.price}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
