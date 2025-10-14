'use client';

import { lazy, Suspense, useEffect, useState } from 'react';
import { LayoutDashboard, Monitor, Users } from 'lucide-react'; // ✅ Lucide icons
import { motion } from 'framer-motion'; // For animations

// Avoid SSR hydration issues by loading react-countup on the client.
const CountUp = lazy(() => import('react-countup'));

/** Hook: respects user\'s motion preferences */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

/** Utility: parse a metric like "98%", "3.8x", "$1,200+", "1.5M", "€23.4k" */
function parseMetricValue(raw: string) {
  const value = (raw ?? '').toString().trim();
  const m = value.match(
    /^([^\d\-+]*?)\s*([\-+]?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([^\d\s]*)$/,
  );
  if (!m) {
    return { prefix: '', end: 0, suffix: value, decimals: 0 };
  }
  const [, prefix, num, suffix] = m;
  const normalized = num.replace(/,/g, '');
  const end = parseFloat(normalized);
  const decimals = normalized.split('.')[1]?.length ?? 0;
  return {
    prefix: prefix ?? '',
    end: isNaN(end) ? 0 : end,
    suffix: suffix ?? '',
    decimals,
  };
}

/** Small component: one animated metric */
function MetricStat({
  value,
  label,
  sub,
  duration = 1.6,
}: {
  value: string;
  label: string;
  sub?: string;
  duration?: number;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const { prefix, end, suffix, decimals } = parseMetricValue(value);

  return (
    <div className="flex flex-col gap-2 p-6 text-left">
      <p
        className="text-2xl font-medium text-gray-900 sm:text-4xl"
        aria-label={`${label} ${value}`}>
        {prefix}
        {reduceMotion ? (
          <span className="font-extrabold text-helix-accent">
            {end.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
            {suffix}
          </span>
        ) : (
          <Suspense fallback={<span className="font-extrabold text-helix-accent">{end}{suffix}</span>}>
            <CountUp
              className="font-extrabold text-helix-accent"
              end={end}
              decimals={decimals}
              duration={duration}
              separator=","
              enableScrollSpy
              scrollSpyOnce
              suffix={suffix}
            />
          </Suspense>
        )}
      </p>
      <p className="text-left font-medium text-gray-900">
        {label}
      </p>
      {sub ? <p className="text-left text-gray-600">{sub}</p> : null}
    </div>
  );
}

export default function Casestudies() {
  const caseStudies = [
    {
      id: 1,
      quote:
        'NATO under probe for irregularities in drone and ammo contracts. Insider leaks and opaque contractor vetting expose risks in global procurement.',
      name: 'NATO Procurement Probe',
      role: 'Military contracts compromised',
      image:
        "images/drone.jpeg",
      icon: Monitor,
      metrics: [
        { value: '100%', label: 'Bid Transparency', sub: 'Publicly auditable bids' },
        { value: '99%', label: 'Less Collusion', sub: 'Verified vendor histories' },
      ],
    },
    {
      id: 2,
      quote:
        'PCI chief allegedly approved 870 pharmacy colleges in 13 days via virtual bribes. Fake accreditations endangered education and public health.',
      name: 'Pharmacy Council of India Scam',
      role: '870 fake colleges cleared',
      image:
        'images/pharma.jpeg',
      icon: LayoutDashboard,
      metrics: [
        { value: '98%', label: 'Fraud Detection', sub: 'Public challenge system' },
        { value: '100%', label: 'Audit Proof', sub: 'Immutable approval trail' },
      ],
    },
    {
      id: 3,
      quote:
        'CBI arrests NAAC officials for bribery in inflated ratings, deceiving students and employers. Trust in accreditation severely damaged.',
      name: 'NAAC Ratings Bribery Case',
      role: 'Accreditation scam exposed',
      image:
        'images/NAAC.jpeg',
      icon: Users,
      metrics: [
        { value: '95%', label: 'Fraud Detection', sub: 'Flags rating anomalies' },
        { value: '100%', label: 'Record Transparency', sub: 'On-chain audit logs' },
      ],
    },
      ];


  return (
    <motion.section
      id="problem"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="bg-white py-20"
      aria-labelledby="case-studies-heading">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-2xl flex-col gap-4 text-center">
          <h2
            id="case-studies-heading"
            className="text-4xl font-extrabold text-gray-900 md:text-5xl">
            Corruption is a Systemic Failure.
          </h2>
          <p className="text-gray-600">
            From defense contracts to educational accreditations, opaque systems are vulnerable to manipulation. We need a new foundation of transparency to restore trust.
          </p>
        </motion.div>

        {/* Cases */}
        <div className="mt-20 flex flex-col gap-20">
          {caseStudies.map((study, idx) => {
            const reversed = idx % 2 === 1;
            return (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                className="grid items-center gap-12 border-b border-gray-200 pb-12 lg:grid-cols-3 xl:gap-24">
                {/* Left: Image + Quote */}
                <div
                  className={[
                    'flex flex-col gap-10 text-left sm:flex-row lg:col-span-2 lg:border-r lg:pr-12 xl:pr-16',
                    reversed
                      ? 'lg:order-2 lg:border-l lg:border-r-0 lg:pl-12 lg:pr-0 xl:pl-16 border-gray-200'
                      : 'border-gray-200',
                  ].join(' ')}>
                  <motion.img
                    whileHover={{ scale: 1.05, boxShadow: '0px 10px 30px -5px rgba(0, 0, 0, 0.3)' }}
                    transition={{ duration: 0.3 }}
                    src={study.image}
                    alt={`${study.name} portrait`}
                    width={300}
                    height={400}
                    className="aspect-[29/35] h-auto w-full max-w-60 rounded-2xl object-cover ring-1 ring-border"
                    loading="lazy"
                    decoding="async"
                  />
                  <figure className="flex flex-col justify-between gap-8 text-left">
                    <blockquote className="text-lg leading-relaxed text-gray-900 sm:text-xl">
                      <h3 className="text-left text-lg font-normal leading-relaxed text-gray-900 sm:text-xl lg:text-xl">
                          {study.name}
                        <span className="mt-2 block text-sm text-gray-500 sm:text-base lg:text-lg">
                          {study.quote}
                        </span>
                      </h3>
                    </blockquote>
                    <figcaption className="mt-4 flex items-center gap-6 text-left">
                      <div className="flex flex-col gap-1">
                        <span className="text-md font-medium text-gray-900">
                          The Problem{' '}
                        </span>
                        <span className="text-sm text-gray-600">
                          {study.role}
                        </span>
                      </div>
                    </figcaption>
                  </figure>
                </div>

                {/* Right: Metrics */}
                <div
                  className={[
                    'grid grid-cols-1 gap-10 self-center text-left',
                    reversed ? 'lg:order-1' : '',
                  ].join(' ')}>
                  {study.metrics.map((metric, i) => (
                    <MetricStat
                      key={`${study.id}-${i}`}
                      value={metric.value}
                      label={metric.label}
                      sub={metric.sub}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
