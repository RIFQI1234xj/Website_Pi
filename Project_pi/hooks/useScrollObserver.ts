import { useEffect } from 'react';

export const useScrollObserver = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: unobserve after revealing if you want it to animate only once
            // observer.unobserve(entry.target); 
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Offset slightly to trigger before bottom
      }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []); // Empty dependency array ensures this runs once on mount/updates
};