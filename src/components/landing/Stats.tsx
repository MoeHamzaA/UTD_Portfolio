'use client';

import { experiences } from '@/config/Experience';
import { projects } from '@/config/Projects';
import { useEffect, useRef, useState } from 'react';

import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

// All values are derived from config data so they stay in sync automatically.
function getStats(): Stat[] {
  // Years of experience — anchored to the earliest professional start date.
  const earliest = experiences.reduce((min, experience) => {
    const start = new Date(experience.startDate).getTime();
    return Number.isFinite(start) && start < min ? start : min;
  }, Date.now());
  const years = Math.floor(
    (Date.now() - earliest) / (1000 * 60 * 60 * 24 * 365.25),
  );

  // Distinct technologies across every role and project.
  const technologies = new Set<string>();
  experiences.forEach((experience) =>
    experience.technologies.forEach((technology) =>
      technologies.add(technology.name),
    ),
  );
  projects.forEach((project) =>
    project.technologies.forEach((technology) =>
      technologies.add(technology.name),
    ),
  );

  return [
    { value: years, suffix: '+', label: 'Years Experience' },
    { value: experiences.length, label: 'Companies' },
    { value: projects.length, label: 'Projects Shipped' },
    { value: technologies.size, label: 'Technologies' },
  ];
}

// Count up to `target` once `start` becomes true, respecting reduced-motion.
function useCountUp(target: number, start: boolean, duration = 1200): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);

  return value;
}

function StatCard({ value, suffix, label, start }: Stat & { start: boolean }) {
  const count = useCountUp(value, start);
  return (
    <div className="tag-inner-shadow border-border flex flex-col items-center justify-center rounded-md border bg-black/[0.02] px-3 py-5 text-center dark:bg-white/[0.03]">
      <span className="text-3xl font-bold tabular-nums sm:text-4xl">
        {count}
        {suffix}
      </span>
      <span className="text-secondary mt-1.5 text-xs sm:text-sm">{label}</span>
    </div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats = getStats();

  return (
    <Container className="mt-20">
      <SectionHeading subHeading="At a glance" heading="By the numbers" />
      <div ref={ref} className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} start={inView} />
        ))}
      </div>
    </Container>
  );
}
