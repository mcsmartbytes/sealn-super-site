'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/utils/supabase';

interface EmbeddedAppFrameProps {
  appUrl: string;
  appName: string;
  appIcon: string;
  standaloneUrl: string;
  description: string;
  headerColor: string; // Tailwind gradient classes for the integration notice
  fullscreenHeaderColor: string; // Tailwind bg class for fullscreen header
  features?: FeatureItem[];
  additionalFeatures?: FeatureItem[];
  integrationBanner?: {
    icon: string;
    title: string;
    items: { icon: string; title: string; description: string }[];
  };
  permissions?: string;
}

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

// Allowed origins for postMessage auth - add your app domains here
const ALLOWED_ORIGINS = [
  'https://sitesense-lilac.vercel.app',
  'https://crm-made-easy.vercel.app',
  'https://expenses-made-easy-opal.vercel.app',
  'https://books-made-easy-app.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
];

export default function EmbeddedAppFrame({
  appUrl,
  appName,
  appIcon,
  standaloneUrl,
  description,
  headerColor,
  fullscreenHeaderColor,
  features = [],
  additionalFeatures = [],
  integrationBanner,
  permissions = '',
}: EmbeddedAppFrameProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [embeddedUrl, setEmbeddedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<'pending' | 'sent' | 'confirmed'>('pending');
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const tokenSentRef = useRef(false);

  // Build embedded URL without token (token sent via postMessage)
  useEffect(() => {
    const url = new URL(appUrl);
    url.searchParams.set('embedded', 'true');
    setEmbeddedUrl(url.toString());
    setIsLoading(false);
  }, [appUrl]);

  // Send auth token to iframe via postMessage
  const sendAuthToken = useCallback(async (targetOrigin: string) => {
    if (tokenSentRef.current) return;

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        console.error('Failed to get session for postMessage auth');
        setError('No active session');
        return;
      }

      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: 'AUTH_TOKEN', token: session.access_token },
          targetOrigin
        );
        tokenSentRef.current = true;
        setAuthStatus('sent');
      }
    } catch (err) {
      console.error('Error sending auth token:', err);
      setError('Failed to authenticate embedded app');
    }
  }, []);

  // Listen for messages from embedded apps
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin
      const origin = event.origin;
      if (!ALLOWED_ORIGINS.includes(origin)) {
        // Also allow same origin or if the appUrl matches
        const appOrigin = new URL(appUrl).origin;
        if (origin !== appOrigin && origin !== window.location.origin) {
          console.warn('Blocked postMessage from unauthorized origin:', origin);
          return;
        }
      }

      // Handle ready message from embedded app
      if (event.data?.type === 'EMBEDDED_APP_READY') {
        sendAuthToken(origin);
      }

      // Handle auth confirmation
      if (event.data?.type === 'AUTH_CONFIRMED') {
        setAuthStatus('confirmed');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [appUrl, sendAuthToken]);

  // Refresh token and send to iframe periodically
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      if (authStatus === 'confirmed' && iframeRef.current?.contentWindow) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const appOrigin = new URL(appUrl).origin;
          iframeRef.current.contentWindow.postMessage(
            { type: 'AUTH_TOKEN_REFRESH', token: session.access_token },
            appOrigin
          );
        }
      }
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(refreshInterval);
  }, [appUrl, authStatus]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-100 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={buildEmbeddedUrl}
            className="px-4 py-2 bg-brand-navy text-white rounded-lg hover:bg-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Header - Non-fullscreen */}
      {!isFullscreen && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{appName}</h1>
              <p className="text-gray-600">{description}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsFullscreen(true)}
                className="px-4 py-2 bg-brand-navy text-white rounded-lg hover:bg-blue-800 transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Fullscreen
              </button>
              <a
                href={standaloneUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand-gold text-brand-dark rounded-lg hover:bg-yellow-500 transition flex items-center gap-2 font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open Standalone
              </a>
            </div>
          </div>

          {/* Integration Status Badges */}
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              INTEGRATED
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              STANDALONE READY
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              SEAMLESS AUTH
            </span>
          </div>

          {/* Integration Notice */}
          <div className={`mt-4 bg-gradient-to-r ${headerColor} rounded-lg p-4 text-white`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{appIcon}</span>
              </div>
              <div>
                <p className="font-semibold">{appName}</p>
                <p className="text-sm opacity-90 mt-1">
                  {description} Available as a premium integration for your business website or as a standalone SaaS product.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Header */}
      {isFullscreen && (
        <div className={`${fullscreenHeaderColor} text-white px-4 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{appIcon}</span>
            <span className="font-bold text-lg">{appName}</span>
            <span className="px-2 py-1 bg-emerald-500 text-white text-xs rounded font-semibold">INTEGRATED</span>
            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded font-semibold">STANDALONE</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={standaloneUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Standalone
            </a>
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Exit Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Iframe Container */}
      <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${isFullscreen ? 'h-[calc(100vh-56px)]' : 'h-[800px]'}`}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy mx-auto mb-4"></div>
              <p className="text-gray-600">Connecting to {appName}...</p>
              <p className="text-sm text-gray-400 mt-2">Setting up seamless authentication</p>
            </div>
          </div>
        ) : embeddedUrl ? (
          <iframe
            ref={iframeRef}
            src={embeddedUrl}
            className="w-full h-full border-0"
            title={appName}
            allow={permissions || 'geolocation; camera; microphone'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <p className="text-gray-600">Failed to load {appName}</p>
          </div>
        )}
      </div>

      {/* Features Grid - Only show when not fullscreen */}
      {!isFullscreen && features.length > 0 && (
        <>
          {/* Integration Banner */}
          {integrationBanner && (
            <div className={`mt-8 bg-gradient-to-r ${headerColor} rounded-xl p-5 text-white`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{integrationBanner.icon}</span>
                <h3 className="text-lg font-bold">{integrationBanner.title}</h3>
              </div>
              <div className={`grid md:grid-cols-${integrationBanner.items.length} gap-4`}>
                {integrationBanner.items.map((item, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-3">
                    <div className="text-xl mb-1">{item.icon}</div>
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-xs opacity-80">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Features Grid */}
          <div className="mt-6 grid md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="font-bold text-gray-800">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Additional Features */}
          {additionalFeatures.length > 0 && (
            <div className="mt-4 grid md:grid-cols-4 gap-4">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-bold text-gray-800">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
