import { useEffect, type RefObject } from "react";

export function useInfiniteScroll(
  sentinelRef: RefObject<HTMLElement | null>,
  onLoadMore: () => void,
  enabled = true,
) {
  useEffect(() => {
    const node = sentinelRef.current;
    if (!enabled || !node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [sentinelRef, onLoadMore, enabled]);
}
