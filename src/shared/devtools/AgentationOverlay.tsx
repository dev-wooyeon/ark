'use client';

import { useEffect, useState } from 'react';
import { Agentation } from 'agentation';

const DEFAULT_AGENTATION_ENDPOINT = '/api/agentation-sync';
const DEFAULT_AGENTATION_WEBHOOK_URL = '/api/agentation/webhook';
const AGENTATION_HEALTHCHECK_URL = '/api/agentation/health';
const HEALTHCHECK_INTERVAL_MS = 30000;

type AgentationHealthResponse = {
  ok?: boolean;
};

export default function AgentationOverlay() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isAutomation =
    typeof navigator !== 'undefined' && navigator.webdriver === true;
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if (!isDevelopment || isAutomation) {
      setIsAvailable(false);
      return;
    }

    let isMounted = true;

    async function checkAvailability() {
      try {
        const response = await fetch(AGENTATION_HEALTHCHECK_URL, {
          cache: 'no-store',
        });
        const data = (await response.json()) as AgentationHealthResponse;

        if (!isMounted) {
          return;
        }

        setIsAvailable(response.ok && data.ok === true);
      } catch {
        if (isMounted) {
          setIsAvailable(false);
        }
      }
    }

    void checkAvailability();

    const intervalId = window.setInterval(() => {
      void checkAvailability();
    }, HEALTHCHECK_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [isAutomation, isDevelopment]);

  if (!isDevelopment || isAutomation || !isAvailable) {
    return null;
  }

  return (
    <Agentation
      endpoint={
        process.env.NEXT_PUBLIC_AGENTATION_ENDPOINT ??
        DEFAULT_AGENTATION_ENDPOINT
      }
      webhookUrl={
        process.env.NEXT_PUBLIC_AGENTATION_WEBHOOK_URL ??
        DEFAULT_AGENTATION_WEBHOOK_URL
      }
    />
  );
}
