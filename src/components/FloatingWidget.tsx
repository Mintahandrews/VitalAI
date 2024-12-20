import { useState } from "react";
import { Github, Coffee, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-3 mb-2 min-w-[200px]"
          >
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/mintahandrews"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://ko-fi.com/mintahandrews"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-[#FF5E5B]"
              >
                <Coffee className="w-5 h-5" />
                <span>Buy me a coffee</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleWidget}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg transition-colors"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          >
            <Coffee className="w-6 h-6" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingWidget;
