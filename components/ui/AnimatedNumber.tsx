"use client";

import { useSpring, animated } from 'react-spring';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({ 
  value, 
  decimals = 0, 
  prefix = '',
  suffix = '',
  className = ''
}: AnimatedNumberProps) {
  const props = useSpring({ 
    number: value, 
    from: { number: 0 },
    config: { tension: 280, friction: 60 }
  });
  
  return (
    <animated.span className={className}>
      {props.number.to(n => `${prefix}${n.toFixed(decimals)}${suffix}`)}
    </animated.span>
  );
}

