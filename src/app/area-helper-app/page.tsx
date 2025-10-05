"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

export default function AreaHelperAppPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/admin/login?redirect=/area-helper-app');
      return;
    }

    setUser(session.user);

    // Check subscription status
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans (*)
      `)
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    // Check if subscription is still valid
    if (data.current_period_end && new Date(data.current_period_end) < new Date()) {
      setHasAccess(false);
    } else {
      setHasAccess(true);
      setSubscription(data);
    }

    setLoading(false);
  }

  async function trackDownload(platform: string) {
    if (!user) return;

    await supabase.from('app_downloads').insert({
      user_id: user.id,
      app_name: 'Area Helper Pro',
      platform,
      version: '1.0.0'
    });
  }

  function installPWA() {
    // This will be replaced with actual PWA install prompt
    trackDownload('pwa');

    // For now, open the app in a new window
    window.open('/area-helper-pwa', '_blank');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Checking subscription...</div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Subscription Required</h1>
            <p className="text-gray-600 mb-6">
              You need an active subscription to download the Area Helper app.
            </p>
            <button
              onClick={() => router.push('/subscribe')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              View Subscription Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Area Helper Pro
                </h1>
                <p className="text-gray-600">Version 1.0.0</p>
              </div>
              <div className="text-right">
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm">
                  ✓ Subscription Active
                </div>
                {subscription?.subscription_plans && (
                  <p className="text-sm text-gray-600 mt-2">
                    {subscription.subscription_plans.name}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Download Options</h2>

              <div className="space-y-4">
                {/* PWA Install */}
                <div className="border rounded-lg p-6 hover:border-blue-500 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        📱 Install as App (PWA)
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Works on Android, iOS, and Desktop. Install directly from your browser.
                      </p>
                      <ul className="mt-3 text-sm text-gray-600 space-y-1">
                        <li>• Works offline after installation</li>
                        <li>• Appears on your home screen like a native app</li>
                        <li>• Auto-updates when you're online</li>
                      </ul>
                    </div>
                    <div className="ml-6">
                      <button
                        onClick={installPWA}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 whitespace-nowrap"
                      >
                        Install App
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coming Soon - Android APK */}
                <div className="border rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        🤖 Android APK (Coming Soon)
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Native Android app for Google Play Store
                      </p>
                    </div>
                    <div className="ml-6">
                      <button
                        disabled
                        className="bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coming Soon - iOS */}
                <div className="border rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        🍎 iOS App (Coming Soon)
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Native iOS app for App Store
                      </p>
                    </div>
                    <div className="ml-6">
                      <button
                        disabled
                        className="bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-3">Installation Instructions</h3>
            <div className="space-y-4 text-sm text-blue-800">
              <div>
                <strong>On Android:</strong>
                <ol className="list-decimal list-inside ml-2 mt-1 space-y-1">
                  <li>Click "Install App" button above</li>
                  <li>Tap "Add to Home Screen" when prompted</li>
                  <li>Find the app icon on your home screen</li>
                </ol>
              </div>
              <div>
                <strong>On iPhone/iPad:</strong>
                <ol className="list-decimal list-inside ml-2 mt-1 space-y-1">
                  <li>Click "Install App" button above</li>
                  <li>Tap the Share button in Safari</li>
                  <li>Select "Add to Home Screen"</li>
                  <li>Tap "Add" to confirm</li>
                </ol>
              </div>
              <div>
                <strong>On Desktop:</strong>
                <ol className="list-decimal list-inside ml-2 mt-1 space-y-1">
                  <li>Click "Install App" button above</li>
                  <li>Click "Install" in your browser's install prompt</li>
                  <li>Access from your apps menu or desktop</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
