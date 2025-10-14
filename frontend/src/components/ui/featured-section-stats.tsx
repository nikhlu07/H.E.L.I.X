'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function FeaturedSectionStats() {
  const data = [
    { name: "Jan", value: 20 },
    { name: "Feb", value: 40 },
    { name: "Mar", value: 60 },
    { name: "Apr", value: 80 },
    { name: "May", value: 100 },
    { name: "Jun", value: 130 },
    { name: "Jul", value: 160 },
  ];

  const main = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
        const tlStats = gsap.timeline({
            scrollTrigger: {
                trigger: main.current,
                start: "top 80%",
                toggleActions: "play none none none",
            }
        });
        tlStats.from("h3", {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out",
        })
        .from(gsap.utils.toArray('.feature-card'), {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
        }, "-=0.5");

    }, main);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={main} className="w-full max-w-6xl mx-auto text-left min-h-screen flex flex-col justify-center">
      <div className="px-4">
        <h3 className="text-lg sm:text-xl lg:text-4xl font-medium text-gray-900 dark:text-white mb-16">
          Powering teams with real-time insights.{" "}
          <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-4xl">
            Our next-gen analytics dashboard helps you track performance, manage
            clients, and make data-driven decisions in seconds.
          </span>
        </h3>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
          <div className="feature-card">
            <p className="text-3xl font-medium text-gray-900">99%</p>
            <p className="text-gray-500 text-md">Success Rate</p>
          </div>
          <div className="feature-card">
            <p className="text-3xl font-medium text-gray-900">99.9%</p>
            <p className="text-gray-500 text-md">Uptime Guarantee</p>
          </div>
          <div className="feature-card">
            <p className="text-3xl font-medium text-gray-900">75%</p>
            <p className="text-gray-500 text-md">Supply Chain Acceleration</p>
          </div>
          <div className="feature-card">
            <p className="text-3xl font-medium text-gray-900">1.2s</p>
            <p className="text-gray-500 text-md">Avg. Response Time</p>
          </div>
        </div>
      </div>

      {/* Area Chart */}
      <div className="w-full h-48 mt-8 feature-card">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffd700" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ffd700" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ffd700"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrimary)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
