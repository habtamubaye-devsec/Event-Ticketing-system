import PublicContentLayout from "../../layouts/public-content-layout";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import SEO from "../../components/SEO";

export default function FAQPage() {
    return (
        <>
            <SEO
                title="FAQ - Frequently Asked Questions"
                description="Find answers to common questions about Qetero Events. Learn about creating events, ticket sales, fees, refunds, and more."
                keywords="FAQ, help, support, questions, event ticketing, how to use Qetero"
                canonicalPath="/faq"
            />
            <PublicContentLayout
                title="Frequently Asked Questions"
                subtitle="Everything you need to know about Qetero and how it works."
                category="Support"
            >
                <div className="space-y-4 not-prose">
                    <FAQItem
                        question="How do I create an event on Qetero?"
                        answer="Creating an event is simple! Just sign up for an organizer account, verify your email, and click 'Create Event' in your dashboard. You'll be guided through setting up details, tickets, and media."
                    />
                    <FAQItem
                        question="What are the fees for selling tickets?"
                        answer="We charge a small platform fee of 5% per ticket sold. Free events are completely free to host and list on Qetero."
                    />
                    <FAQItem
                        question="How do I get paid?"
                        answer="Payouts are processed automatically to your registered bank account 3-5 business days after your event concludes successfully."
                    />
                    <FAQItem
                        question="Can I refund a ticket?"
                        answer="Yes, as an organizer you have full control to issue refunds through your dashboard. Users can also request refunds subject to your specific event policy."
                    />
                    <FAQItem
                        question="Is there a mobile app?"
                        answer="We are currently mobile-responsive web-first, but native iOS and Android apps are on our roadmap for late 2024!"
                    />
                </div>
            </PublicContentLayout>
        </>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`border border-slate-200 rounded-2xl transition-all duration-300 ${isOpen ? 'bg-white shadow-md border-primary/20' : 'bg-slate-50 hover:bg-white'}`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
            >
                <span className={`font-bold text-lg ${isOpen ? 'text-primary' : 'text-slate-800'}`}>{question}</span>
                <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-primary/10 text-primary' : 'bg-white text-slate-400'}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-6 pb-6 text-slate-600 leading-relaxed font-medium">
                    {answer}
                </div>
            </div>
        </div>
    );
}
