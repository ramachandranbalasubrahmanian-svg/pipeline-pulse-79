import { ANALYTICS_CONFIG } from "./analytics-config";

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

let initialized = false;

function isProd(): boolean {
  if (typeof window === "undefined") return false;
  return ANALYTICS_CONFIG.prodDomains.includes(window.location.hostname);
}

export function initAnalytics(): void {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;

  if (!isProd()) {
    window.gtag = () => {};
    return;
  }

  const { ga4Id } = ANALYTICS_CONFIG;
  if (!ga4Id) {
    window.gtag = () => {};
    return;
  }

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", ga4Id, {
    send_page_view: false,
    anonymize_ip: true,
  });
}

export function trackPageView(path: string, title?: string): void {
  if (!window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title || document.title,
    site: ANALYTICS_CONFIG.site,
  });
}

export function trackEvent(name: string, params?: EventParams): void {
  if (!window.gtag) return;
  window.gtag("event", name, { site: ANALYTICS_CONFIG.site, ...params });
}
