"use client";

import {
  motion,
  useInView,
  animate,
  useIsomorphicLayoutEffect,
} from "framer-motion";
import { useRef } from "react";

const stats = [
  {
    num: 3,
    text: "+ years of non-corporate exp",
  },
  {
    num: 27,
    text: "+ projects build & deployed",
  },
  {
    num: 12,
    text: "+ technologies mastered.",
  },
  {
    num: 1699,
    text: "+ code commits on github!",
  },
];

type CountUpProps = {
  start?: number;
  end: number;
  duration: number;
  delay?: number;
  className?: string;
  once?: boolean;
};
const CountUp = ({
  start,
  end,
  duration,
  delay,
  className,
  once,
}: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: 0.5, once });
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || !isInView) {
      return;
    }
    el.textContent = String(start) || String(0);
    const control = animate(start || 0, end, {
      duration: duration || 2,
      delay: delay,
      ease: "easeOut",
      onUpdate(value) {
        el.textContent = value?.toFixed(0) || "0";
      },
    });
    return () => {
      control.stop();
    };
  }, [isInView, duration, delay, start, end]);
  return <span ref={ref} className={className} />;
};

const Stats = () => {
  return (
    <section className="pt-4 pb-12 xl:pt-0 xl:pb-0" aria-hidden="true">
      <motion.div className="flex justify-center items-center mx-2 xl:mx-4">
        <div className="w-full h-full flex flex-wrap gap-6 max-w-[80vw] xl:max-w-none">
          {stats.map((item, index) => {
            return (
              <div
                className="flex flex-1 items-center gap-4 justify-center"
                key={index}
                aria-hidden="true"
              >
                <CountUp
                  // start={0}
                  end={item.num}
                  duration={5}
                  // delay={1.5}
                  className="w-28 h-16 text-4xl xl:text-6xl font-extrabold flex justify-end items-center"
                />
                <p
                  className={`${
                    item.text.length < 15 ? "max-w-[100px]" : "max-w-[150px]"
                  } leading-snug text-white/50`}
                >
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default Stats;
