import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";
import "./index.css";

NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  trickleSpeed: 200,
});

export default function ProgressBar() {
  useEffect(() => {
    let lastHref = window.location.href;

    const handleRouteChange = () => {
      NProgress.start();
      const timer = setTimeout(() => NProgress.done(), 100);
      return () => {
        clearTimeout(timer);
        NProgress.done();
      };
    };

    const observer = new MutationObserver(() => {
      const currentHref = window.location.href;
      if (currentHref !== lastHref) {
        lastHref = currentHref;
        handleRouteChange();
      }
    });

    observer.observe(document, {
      subtree: true,
      childList: true,
    });

    window.addEventListener("popstate", handleRouteChange);

    handleRouteChange();

    return () => {
      observer.disconnect();
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  return null;
}
