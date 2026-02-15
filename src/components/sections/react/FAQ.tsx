import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQProps {
  faqItems: FAQItem[];
}

export default function FAQ({ faqItems }: FAQProps) {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {faqItems.map((item, i) => (
        <div
          key={i}
          className="border-2 border-warm-200 rounded-lg overflow-hidden hover:border-accent-DEFAULT transition-colors"
        >
          <button
            onClick={() => setOpenId(openId === i ? null : i)}
            className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-warm-50 transition-colors text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-DEFAULT"
          >
            <span className="font-bold text-warm-900 flex-1">{item.q}</span>
            <motion.div
              animate={{ rotate: openId === i ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              <ChevronDown className="w-5 h-5 text-accent-DEFAULT" />
            </motion.div>
          </button>

          <AnimatePresence>
            {openId === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-warm-50 border-t border-warm-200"
              >
                <p className="px-6 py-4 text-warm-700 leading-relaxed whitespace-pre-line">
                  {item.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
