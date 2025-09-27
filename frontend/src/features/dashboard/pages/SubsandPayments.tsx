import React, { useState } from "react";
import {
    User,
    Rocket,
    Building2,
    Check,
    X,
    ChevronDown,
    CreditCard,
    BadgeDollarSignIcon,
    Apple,
} from "lucide-react";
import Navbar from "@/components/Navbar.tsx"

export default function PremiumSubscription() {
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: "Can I cancel my subscription anytime?",
            a: "Yes, you can cancel your subscription at any time. Your access to premium features will continue until the end of your current billing period.",
        },
        {
            q: "Is there a free trial available?",
            a: "We offer a 14-day free trial for all new users. No credit card is required to start the trial.",
        },
        {
            q: "What payment methods do you accept?",
            a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay.",
        },
        {
            q: "How can I change my subscription plan?",
            a: "You can upgrade or downgrade your plan at any time from your account settings. Changes will take effect at the start of your next billing cycle.",
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Choose Your Plan
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Unlock premium features and take your experience to the next level
                        with our flexible subscription options.
                    </p>
                </header>

                {/* Plans */}
                <div className="flex flex-wrap justify-center gap-8 mb-16">
                    {/* Free */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full md:w-80">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                    <User className="h-5 w-5 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Free</h3>
                            </div>
                            <p className="text-gray-600 mb-6">Basic features to get started</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-800">$0</span>
                                <span className="text-gray-500">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-gray-600">
                                    <Check className="h-5 w-5 text-green-500 mr-2" /> Basic access
                                </li>
                                <li className="flex items-center text-gray-600">
                                    <Check className="h-5 w-5 text-green-500 mr-2" /> Limited
                                    features
                                </li>
                                <li className="flex items-center text-gray-400">
                                    <X className="h-5 w-5 mr-2" /> Premium support
                                </li>
                                <li className="flex items-center text-gray-400">
                                    <X className="h-5 w-5 mr-2" /> Advanced analytics
                                </li>
                            </ul>
                            <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition">
                                Current Plan
                            </button>
                        </div>
                    </div>

                    {/* Pro */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full md:w-80 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative">
                        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-3 py-1 text-xs font-bold rounded-bl-lg">
                            POPULAR
                        </div>
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-purple-100 p-2 rounded-full mr-3">
                                    <Rocket className="h-5 w-5 text-purple-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Pro</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                For professionals who need more
                            </p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-800">$9</span>
                                <span className="text-gray-500">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {[
                                    "Full access",
                                    "All features",
                                    "Priority support",
                                    "Advanced analytics",
                                ].map((f) => (
                                    <li key={f} className="flex items-center text-gray-600">
                                        <Check className="h-5 w-5 text-green-500 mr-2" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-2 px-4 rounded-md text-white font-medium transition bg-gradient-to-tr from-indigo-400 to-purple-400 hover:opacity-90">
                                Upgrade to Pro
                            </button>
                        </div>
                    </div>

                    {/* Enterprise */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full md:w-80">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-100 p-2 rounded-full mr-3">
                                    <Building2 className="h-5 w-5 text-green-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Enterprise
                                </h3>
                            </div>
                            <p className="text-gray-600 mb-6">For large scale businesses</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-800">$29</span>
                                <span className="text-gray-500">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {[
                                    "Unlimited access",
                                    "All features",
                                    "24/7 dedicated support",
                                    "Custom solutions",
                                ].map((f) => (
                                    <li key={f} className="flex items-center text-gray-600">
                                        <Check className="h-5 w-5 text-green-500 mr-2" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>

                {/* Payment */}
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Payment Information
                        </h2>

                        {/* Order summary */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-8">
                            <h3 className="font-semibold text-gray-700 mb-2">Order Summary</h3>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-800 font-medium">Pro Plan</p>
                                    <p className="text-sm text-gray-500">Billed monthly</p>
                                </div>
                                <span className="text-gray-800 font-bold">$9.00</span>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-gray-700 mb-4">Payment Method</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                {[
                                    { id: "card", label: "Credit Card", icon: CreditCard },
                                    { id: "BadgeDollarSignIcon", label: "Paypal", icon: BadgeDollarSignIcon },
                                    { id: "apple", label: "Apple Pay", icon: Apple },
                                ].map(({ id, label, icon: Icon }) => (
                                    <div
                                        key={id}
                                        onClick={() => setPaymentMethod(id)}
                                        className={`border rounded-lg p-4 cursor-pointer transition hover:shadow-md flex items-center ${
                                            paymentMethod === id ? "border-indigo-400 bg-indigo-50" : ""
                                        }`}
                                    >
                                        <Icon className="h-5 w-5 text-blue-500 mr-3" />
                                        <span className="font-medium">{label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Forms */}
                            {paymentMethod === "card" && (
                                <div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="card-name"
                                            className="block text-gray-700 text-sm font-medium mb-2"
                                        >
                                            Name on Card
                                        </label>
                                        <input
                                            id="card-name"
                                            type="text"
                                            placeholder="John Smith"
                                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Card Details
                                        </label>
                                        <div className="border p-3 rounded-md bg-white">
                                            {/* Stripe Elements Placeholder */}
                                            <span className="text-gray-400 text-sm">
                        Card Input Placeholder
                      </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === "paypal" && (
                                <div className="bg-gray-100 p-4 rounded-md text-center">
                                    <p className="text-gray-600 mb-4">
                                        You will be redirected to PayPal to complete your payment
                                    </p>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md">
                                        Continue with PayPal
                                    </button>
                                </div>
                            )}

                            {paymentMethod === "apple" && (
                                <div className="bg-gray-100 p-4 rounded-md text-center">
                                    <p className="text-gray-600 mb-4">
                                        Complete your payment with Apple Pay
                                    </p>
                                    <button className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-md">
                                        Pay with Apple Pay
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Billing Address */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-gray-700 mb-4">Billing Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Country
                                    </label>
                                    <select className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500">
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>United Kingdom</option>
                                        <option>Australia</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        ZIP / Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="10001"
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <label className="flex items-center text-sm text-gray-600">
                                <input type="checkbox" className="h-4 w-4 text-blue-600 mr-2" />
                                I agree to the
                                <a href="#" className="text-blue-500 hover:underline ml-1">
                                    Terms of Service
                                </a>
                                and
                                <a href="#" className="text-blue-500 hover:underline ml-1">
                                    Privacy Policy
                                </a>
                            </label>
                            <button className="mt-4 md:mt-0 bg-gradient-to-tr from-indigo-400 to-purple-400 text-white font-medium py-2 px-6 rounded-md hover:opacity-90 transition">
                                Complete Subscription
                            </button>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto mt-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="border-b border-gray-200 pb-4">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="flex justify-between items-center w-full text-left font-medium text-gray-700"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        className={`h-5 w-5 text-gray-500 transition-transform ${
                                            openFaq === idx ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                                {openFaq === idx && (
                                    <div className="mt-2 text-gray-600">{faq.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
