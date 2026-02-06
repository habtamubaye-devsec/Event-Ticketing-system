import PublicContentLayout from "../../layouts/public-content-layout";
import SEO from "../../components/SEO";

export default function PrivacyPage() {
    return (
        <>
            <SEO
                title="Privacy Policy"
                description="Learn about how Qetero Events collects, uses, and protects your personal information. Read our privacy policy for data security and user rights."
                keywords="privacy policy, data protection, personal information, security, user rights"
                canonicalPath="/privacy"
            />
            <PublicContentLayout
                title="Privacy Policy"
                subtitle="We care about your data and how it is used."
                category="Legal"
                lastUpdated="January 1, 2024"
            >
                <section>
                    <h3>1. Information We Collect</h3>
                    <p>
                        We collect information you provide directly to us, such as when you create an account, purchase tickets, or contact us for support. This may include your name, email address, payment information, and event preferences.
                    </p>
                </section>

                <section>
                    <h3>2. How We Use Your Information</h3>
                    <p>
                        We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you related information including confirmations and invoices, and to communicate with you about events and news.
                    </p>
                </section>

                <section>
                    <h3>3. Data Sharing</h3>
                    <p>
                        We do not sell your personal data. We may share your information with event organizers for events you register for, and with third-party vendors who perform services on our behalf (e.g., payment processing).
                    </p>
                </section>

                <section>
                    <h3>4. Security</h3>
                    <p>
                        We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                    </p>
                </section>

                <section>
                    <h3>5. Your Rights</h3>
                    <p>
                        You have the right to access, correct, or delete your personal information. You can manage your communication preferences in your account settings.
                    </p>
                </section>
            </PublicContentLayout>
        </>
    );
}
