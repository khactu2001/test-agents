"use client";

import { useEffect, useRef } from "react";

export function ScrollAnchor({ trigger }: { trigger: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView?.({ block: "end" });
  }, [trigger]);
  return <div ref={ref} />;
}
