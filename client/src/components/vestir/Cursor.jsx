import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef   = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    const dot   = dotRef.current;
    const trail = trailRef.current;

    let mx = -200, my = -200;
    let tx = -200, ty = -200;
    let rafId;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };

    function animateTrail() {
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      trail.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animateTrail);
    }
    animateTrail();

    const addHover   = () => document.body.classList.add('cursor-hover');
    const removeHover = () => document.body.classList.remove('cursor-hover');

    const interactiveSelector = 'a, button, input, [data-hover]';
    const hoverEls = () => document.querySelectorAll(interactiveSelector);

    function attachHover() {
      hoverEls().forEach(el => {
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', removeHover);
      });
    }
    attachHover();

    window.addEventListener('mousemove', onMove);

    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}   className="cursor-dot"   aria-hidden="true" />
      <div ref={trailRef} className="cursor-trail"  aria-hidden="true" />
    </>
  );
}
