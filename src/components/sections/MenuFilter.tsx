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

  const filteredItems = menu.items.filter(
    (item) => item.category === activeCategory
  );

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex justify-center gap-3 mb-12 flex-wrap">
        {menu.categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${
              activeCategory === category
                ? "bg-accent-DEFAULT text-warm-900 shadow-soft scale-105"
                : "bg-warm-100 text-warm-700 hover:bg-warm-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={activeCategory}
      >
        {filteredItems.map((item) => (
          <motion.div
            key={item.name}
            className="bg-white rounded-xl p-6 shadow-softer hover:shadow-soft transition-shadow duration-300 border border-warm-100"
            variants={itemVariants}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div className="flex-1">
                <h4 className="font-bold text-warm-900 text-lg mb-2">
                  {item.name}
                </h4>
                <p className="text-sm text-warm-600 mb-3">
                  {item.description}
                </p>
                <p className="font-bold text-accent-DEFAULT">{item.price}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}