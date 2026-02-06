import PublicContentLayout from "../../layouts/public-content-layout";
import SEO from "../../components/SEO";

export default function TermsPage() {
    return (
        <>
            <SEO
                title="Terms of Service"
                description="Read the Terms of Service for Qetero Events. Learn about user conduct, ticket purchases, service description, and limitation of liability."
                keywords="terms of service, legal, user agreement, terms and conditions"
                canonicalPath="/terms"
            />
            <PublicContentLayout
                title="Terms of Service"
                subtitle="Please read these terms carefully before using our platform."
                category="Legal"
                lastUpdated="January 1, 2025"
            >
                <section>
                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing and using Qetero, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>
                </section>

                <section>
                    <h3>2. Service Description</h3>
                    <p>
                        Qetero provides an online platform that allows users to create, discover, share, and register for events. The Service may include ticket sales, event promotion tools, and attendee management features.
                    </p>
                </section>

                <section>
                    <h3>3. User Conduct</h3>
                    <p>
                        You agree to use the Service only for lawful purposes. You are prohibited from posting or transmitting any unlawful, threatening, libelous, defamatory, obscene, scandalous, inflammatory, pornographic, or profane material.
                    </p>
                </section>

                <section>
                    <h3>4. Ticket Purchases</h3>
                    <p>
                        All ticket purchases are final unless stated otherwise by the Event Organizer. Qetero is not responsible for event cancellations or changes, though we will facilitate communication between organizers and attendees.
                    </p>
                </section>

                <section>
                    <h3>5. Limitation of Liability</h3>
                    <p>
                        Qetero shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses.
                    </p>
                </section>
            </PublicContentLayout>
        </>
    );
}
