import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "../../lib/utils";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  count: number;
  defaultOpen?: boolean;
}

export const CollapsibleSection = ({
  title,
  children,
  count,
  defaultOpen = true,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div 
      className="mb-8"
      layout="position"
      transition={{ duration: 0.2, type: "tween" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between py-2 px-4 rounded-lg",
          "hover:bg-primary/10 backdrop-blur-sm transition-colors duration-200",
          "text-left font-semibold text-lg"
        )}
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
          <span className="text-sm font-normal text-muted-foreground">
            ({count})
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 transition-transform duration-200",
            isOpen ? "transform rotate-180" : ""
          )}
        />
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, type: "tween" }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <motion.div layout="position">
                {children}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 