"use client";
import { motion, useInView, Variants } from "framer-motion";
import React, { useRef } from "react";

export const TimelineContent = ({
  children,
  as, // The 'as' prop is not used, but kept for compatibility. A div is used by default.
  animationNum,
  customVariants,
  timelineRef, // The 'timelineRef' prop is not used, but kept for compatibility.
  ...props
}: {
  children: React.ReactNode;
  as?: React.ElementType;
  animationNum: number;
  customVariants: Variants;
  timelineRef?: React.RefObject<HTMLElement>;
  [key: string]: any;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <motion.div
      ref={ref}
      custom={animationNum}
      variants={customVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      {...props}
    >
      {children}
    </motion.div>
  );
};
