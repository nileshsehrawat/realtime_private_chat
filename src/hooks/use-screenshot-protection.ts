import { useEffect } from "react";

export const useScreenshotProtection = () => {
  useEffect(() => {
    // Prevent context menu (right-click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent keyboard shortcuts for screenshots and printing
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Print Screen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        return false;
      }

      // Prevent Shift + Print Screen
      if (e.shiftKey && e.key === "PrintScreen") {
        e.preventDefault();
        return false;
      }

      // Prevent Cmd + Shift + 3 (Mac screenshot entire screen)
      if (e.metaKey && e.shiftKey && e.key === "3") {
        e.preventDefault();
        return false;
      }

      // Prevent Cmd + Shift + 4 (Mac screenshot selected area)
      if (e.metaKey && e.shiftKey && e.key === "4") {
        e.preventDefault();
        return false;
      }

      // Prevent Cmd + Shift + 5 (Mac screenshot with options)
      if (e.metaKey && e.shiftKey && e.key === "5") {
        e.preventDefault();
        return false;
      }

      // Prevent Ctrl/Cmd + Shift + S (Screenshot in Chrome)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "s") {
        e.preventDefault();
        return false;
      }

      // Prevent Ctrl/Cmd + Shift + C (Screenshot in Edge)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "c") {
        e.preventDefault();
        return false;
      }

      // Prevent Ctrl/Cmd + P (Print in all browsers)
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        return false;
      }
    };

    // Prevent text selection and copying
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent dragging
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent print dialog
    const handleBeforePrint = () => {
      document.body.style.visibility = "hidden";
    };

    const handleAfterPrint = () => {
      document.body.style.visibility = "visible";
    };

    // Prevent mobile screenshot/screen recording
    const handleTouchStart = (e: TouchEvent) => {
      // Prevent long press context menu on mobile
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Additional touch prevention
      if (e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element?.tagName !== "INPUT" && element?.tagName !== "TEXTAREA") {
          // Don't prevent on input fields
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu as any);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("dragstart", handleDragStart as any);
    document.addEventListener("touchstart", handleTouchStart as any, {
      passive: false,
    });
    document.addEventListener("touchend", handleTouchEnd as any, {
      passive: false,
    });
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    // Add meta tags to prevent caching and printing
    const metaNoPrint = document.createElement("meta");
    metaNoPrint.name = "no-print";
    metaNoPrint.content = "true";
    document.head.appendChild(metaNoPrint);

    // Prevent iOS screenshot notifications
    const metaViewport = document.querySelector("meta[name='viewport']");
    if (metaViewport) {
      metaViewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover"
      );
    }

    // Add CSS to hide content on print and prevent selection on mobile
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      @media print {
        body {
          display: none !important;
          visibility: hidden !important;
        }
        * {
          display: none !important;
        }
      }
      
      @media (prefers-color-scheme: light) {
        body {
          filter: invert(1);
        }
      }

      /* Mobile screenshot prevention */
      body {
        -webkit-user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-user-callout: none !important;
        -webkit-user-drag: none !important;
        user-select: none !important;
        -moz-user-select: none !important;
      }

      /* Prevent long press menu on iOS */
      input, textarea {
        -webkit-user-select: text !important;
        -webkit-touch-callout: default !important;
        user-select: text !important;
      }

      /* Disable image save */
      img {
        -webkit-user-select: none !important;
        -webkit-touch-callout: none !important;
        pointer-events: none !important;
      }

      /* Additional mobile protections */
      * {
        -webkit-user-callout: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }

      /* Allow selection in inputs only */
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(styleElement);

    // Detect screenshot attempt on some Android devices
    const handleVolumeDown = (e: KeyboardEvent) => {
      if (e.keyCode === 24) {
        // Volume down key on Android
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("keydown", handleVolumeDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu as any);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("dragstart", handleDragStart as any);
      document.removeEventListener("touchstart", handleTouchStart as any);
      document.removeEventListener("touchend", handleTouchEnd as any);
      document.removeEventListener("keydown", handleVolumeDown);
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
      document.head.removeChild(metaNoPrint);
      document.head.removeChild(styleElement);
    };
  }, []);
};
