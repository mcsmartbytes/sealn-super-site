"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  is_active: boolean;
}

export default function SubscribePage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchPlans();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login?redirect=/subscribe');
      return;
    }
    setUser(session.user);

    // Check if user already has subscription
    const { data } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .single();

    if (data) {
      setHasSubscription(true);
    }
  }

  async function fetchPlans() {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price');

    if (error) {
      console.error('Error fetching plans:', error);
    } else {
      setPlans(data || []);
    }
    setLoading(false);
  }

  async function handleSubscribe(planId: string) {
    if (!user) {
      router.push('/admin/login?redirect=/subscribe');
      return;
    }

    // For now, create a demo subscription (you'll integrate Stripe later)
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    const periodEnd = new Date();
    if (plan.interval === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else if (plan.interval === 'yearly') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      // Lifetime - set far future date
      periodEnd.setFullYear(periodEnd.getFullYear() + 100);
    }

    const { error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
        plan_id: planId,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: plan.interval === 'lifetime' ? null : periodEnd.toISOString()
      });

    if (error) {
      alert('Error creating subscription: ' + error.message);
    } else {
      alert('Subscription activated! You can now download the Area Helper app.');
      router.push('/area-helper-app');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading plans...</div>
      </div>
    );
  }

  if (hasSubscription) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">You're Already Subscribed!</h1>
            <p className="text-gray-600 mb-6">You have an active subscription to Area Helper Pro.</p>
            <button
              onClick={() => router.push('/area-helper-app')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Download App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Choose Your Area Helper Plan
          </h1>
          <p className="text-xl text-gray-600">
            Professional area measurement tool for contractors and businesses
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isPopular = plan.interval === 'yearly';
            const savings = plan.interval === 'yearly' ? '20% OFF' : '';

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                  isPopular ? 'ring-4 ring-blue-500 relative' : ''
                }`}
              >
                {isPopular && (
                  <div className="bg-blue-500 text-white text-center py-2 font-semibold text-sm">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {plan.name.split(' - ')[0]}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">
                      {plan.interval === 'lifetime' ? ' one-time' : `/${plan.interval === 'monthly' ? 'mo' : 'yr'}`}
                    </span>
                  </div>

                  {savings && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4">
                      {savings}
                    </div>
                  )}

                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      isPopular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">💳 Secure payment powered by Stripe (coming soon)</p>
          <p>Cancel anytime • 30-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
}
