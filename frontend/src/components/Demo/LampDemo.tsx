"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { Button } from "@/components/ui/button";
import {ArrowRight} from "lucide-react";

export function LampDemo() {
  return (
    <LampContainer>

      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br text-white py-4 bg-clip-text text-center text-4xl font-extrabold tracking-tight text-transparent md:text-7xl"
      >
        When H.E.L.I.X. Rise <br/> So Does Hope
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
        }}
      >
        <div className="flex justify-center items-center gap-4 hero-buttons pt-8">
                {/*<button className="cta-gradient text-white font-semibold px-8 py-3.5 rounded-lg text-base hover:opacity-90 transition-all duration-300 glow flex items-center space-x-2">*/}
                {/*  <span>Try ICP Demo</span>*/}
                {/*  <ArrowRight className="w-5 h-5" />*/}
                {/*</button>*/}
                <a href="https://github.com/nikhlu07/H.E.L.I.X." target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 rounded-lg border-2 border-yellow-400/80 bg-yellow-400/10 px-6 py-3 text-sm font-semibold text-yellow-500 shadow-sm backdrop-blur-sm transition-all hover:border-yellow-400 hover:bg-yellow-400/20 hover:shadow-md">
                   {/*<img src="logo.svg" alt="Helix Logo" className="h-5 w-auto"/>*/}
                    <span >Access Now</span>
                </a>
              </div>
      </motion.div>
    </LampContainer>
  );
}
