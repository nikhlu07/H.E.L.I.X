"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import {VerticalCutReveal} from "@/components/ui/vertical-cut-reveal";
import { useRef } from "react";

export default function PricingSection3() {
  const pricingRef = useRef<HTMLDivElement>(null);
  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const basicFeatures = [
    "Adaptable data models",
    "Configurable alerts",
    "Custom reporting",
    "Donor transparency",
  ];

  const professionalFeatures = [
    "Real-time procurement monitoring",
    "AI fraud detection",
    "Blockchain transparency",
    "Citizen oversight",
    "Auto Vendor Allotment",
  ];

  const enterpriseFeatures = [
    "Reusable algorithms",
    "API integration",
    "Custom workflows",
    "Compliance tracking",
  ];

  return (
    <section
      className="py-16 px-4 bg-white w-full relative min-h-screen flex items-center"
      ref={pricingRef}
    >
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_40%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
      <div className="max-w-6xl mx-auto">
        <article className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.15}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-center"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0, // First element
              }}
            >
              Foundational tech. Infinite possibilities.
            </VerticalCutReveal>
          </h2>

          <TimelineContent
            as="p"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="text-gray-600"
          >
            Open-source system, originally for government procurement, helps NGOs and companies adapt as well.
          </TimelineContent>
        </article>

        <div className="grid md:grid-cols-3 md:gap-8 gap-3 items-end">
          {/* Basic Plan */}
          <TimelineContent
            as="div"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card className="bg-white p-0 h-fit border-neutral-200">
              <CardHeader className="text-left py-4 border-b bg-gray-100 border-neutral-300 rounded-xl">
                <h3 className="text-xl text-gray-900 mb-4">Adaptable</h3>
                <div className="flex justify-start items-end">
                  <span className="text-4xl font-extrabold text-gray-900">
                    NGOs
                  </span>
                  {/*<span className="text-gray-600">/user</span>*/}
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <ul className="space-y-3 mb-6">
                  {basicFeatures.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full p-3 rounded-xl bg-white border border-[#FFCC00] text-black font-semibold shadow-lg shadow-[#FFCC00]/50 hover:bg-[#FFCC00]/90">
                  Under Development
                </button>
              </CardContent>
            </Card>
          </TimelineContent>

          {/* Professional Plan */}
          <TimelineContent
            as="div"
            animationNum={2}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card className="bg-white border  p-0 rounded-lg shadow-lg relative h-fit">
              <CardHeader className="pb-6  rounded-t-lg py-6">
                <div className="flex gap-2 justify-between">
                  <h3 className="text-xl text-black mb-4">Core</h3>
                  <span className="text-black/60 px-2 py-1 text-xs">
                    Try Now
                  </span>
                </div>
                <div className="w-full justify-start flex items-end">
                  <span className="text-4xl font-extrabold text-black">Government</span>
                  {/*<span className="text-gray-800">/month</span>*/}
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <ul className="space-y-3 mb-6">
                  {professionalFeatures.map((feature, index) => (
                    <li key={index} className="text-sm text-black">
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full p-3 border border-gray-800 shadow-lg shadow-black font-semibold  rounded-xl bg-black text-white hover:bg-gray-800">
                  Access
                </button>
              </CardContent>
            </Card>
          </TimelineContent>

          {/* Enterprise Plan */}
          <TimelineContent
            as="div"
            animationNum={3}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card className="bg-white p-0 border-neutral-200">
              <CardHeader className="text-left py-4 border-b bg-gray-100 rounded-xl border-neutral-300">
                <h3 className="text-xl text-gray-900 mb-4">Future</h3>
                <div className="flex justify-start items-end">
                  <span className="text-4xl font-extrabold text-gray-900">
                    Private
                  </span>
                  {/*<span className="text-gray-600">/user</span>*/}
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <ul className="space-y-3 mb-6">
                  {enterpriseFeatures.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full p-3 rounded-xl bg-white border border-[#FFCC00] text-black font-semibold shadow-lg shadow-[#FFCC00]/50 hover:bg-[#FFCC00]/90">
                  Under Development
                </button>
              </CardContent>
            </Card>
          </TimelineContent>
        </div>
      </div>
    </section>
  );
}
