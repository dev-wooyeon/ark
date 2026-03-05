'use client';

import { Agentation } from 'agentation';

const DEFAULT_AGENTATION_ENDPOINT = 'http://localhost:4747';
const DEFAULT_AGENTATION_WEBHOOK_URL = '/api/agentation/webhook';

export default function AgentationOverlay() {
  if (process.env.NODE_ENV !== 'development') {
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
