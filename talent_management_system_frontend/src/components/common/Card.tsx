import React from "react";
import { BadgeCheck, Clock } from "lucide-react";

export default function Cards() {
  const cardData = [
    {
      icon: BadgeCheck,
      title: "100% Swiss Standards",
      desc: "Built with precision, quality, and reliability following Swiss-level engineering standards.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      desc: "Our team is always available to support your hiring and talent management needs anytime.",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-10 px-4 sm:px-0">
      {cardData.map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl 
            p-4 sm:p-6
            bg-white/5 backdrop-blur-xl border border-white/10
            shadow-md sm:shadow-lg
            transition-all duration-300

            /* mobile active effect instead of hover */
            active:scale-[0.98] 

            /* desktop hover */
            sm:hover:scale-[1.04] 
            sm:hover:border-green-300/40
            sm:hover:shadow-green-500/10"
          >
            {/* glow effect (only visible on larger screens) */}
            <div className="hidden sm:block absolute inset-0 
              bg-gradient-to-br from-green-400/10 via-transparent to-transparent 
              opacity-0 group-hover:opacity-100 transition"
            />

            <div className="relative flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-full 
                bg-green-400/20 border border-green-300/30"
              >
                <Icon className="text-green-300 w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white">
                {item.title}
              </h2>
            </div>

            <p className="relative mt-2 sm:mt-3 
              text-xs sm:text-sm text-gray-300 leading-relaxed"
            >
              {item.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}