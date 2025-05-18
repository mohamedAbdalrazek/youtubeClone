// app/privacy-policy/page.tsx
import React from "react";
import styles from "./PrivacyPolicy.module.css";

export default function PrivacyPolicy() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1>Privacy Policy</h1>
                <p className={styles.effectiveDate}>
                    Effective Date: {new Date().toLocaleDateString()}
                </p>

                <section className={styles.section}>
                    <h2>1. Introduction</h2>
                    <p>
                        This Privacy Policy explains how we collect, use, and
                        protect your personal information when you use our
                        service. We are not affiliated with YouTube or Google
                        LLC.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>2. Information We Collect</h2>
                    <p>
                        When you sign in with Google, we only request and store:
                    </p>
                    <ul>
                        <li>Your Google profile picture</li>
                        <li>Your Google account name</li>
                        <li>Your Google account email address</li>
                    </ul>

                    <p>
                        We do <strong>not</strong> have access to your YouTube
                        watch history, YouTube account details, or any other
                        Google service data.
                    </p>
                </section>
                <section className={styles.section}>
                    <h2>2.1 Cookie Usage</h2>
                    <p>
                        We use a single encrypted cookie solely to maintain your
                        authentication session. This cookie contains:
                    </p>
                    <ul>
                        <li>An encrypted version of your user ID</li>
                        <li>No personally identifiable information</li>
                        <li>No tracking data</li>
                    </ul>
                    <p>
                        This cookie is essential for the service to function and
                        is automatically deleted when you sign out or after a
                        period of inactivity.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>3. How We Use Your Information</h2>
                    <p>The information we collect is used solely for:</p>
                    <ul>
                        <li>Creating and authenticating your account</li>
                        <li>
                            Displaying your profile picture and name in the
                            website
                        </li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>4. Data Storage & Security</h2>
                    <p>
                        Your data is stored securely using Firebase
                        Authentication. We implement appropriate technical and
                        organizational measures to protect your personal
                        information.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>5. Content Restrictions</h2>
                    <p>
                        We do not display age-restricted YouTube videos through
                        our service. Our platform is designed to respect content
                        guidelines and restrictions.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>6. Third-Party Services</h2>
                    <p>
                        We use Google Sign-In via Firebase Authentication for
                        user authentication. Google&apos;s Privacy Policy
                        applies to the authentication process and can be found
                        at{" "}
                        <a
                            href="https://policies.google.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            https://policies.google.com/privacy
                        </a>
                        .
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>7. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access the personal data we hold about you</li>
                        <li>
                            Request deletion of your account and associated data
                        </li>
                        <li>Withdraw consent for data processing</li>
                    </ul>
                    <p>
                        To exercise these rights, please contact us through the
                        provided contact methods in the website.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>8. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy periodically. Any
                        changes will be posted on this page with an updated
                        effective date.
                    </p>
                </section>
                <section className={styles.section}>
                    <h2>9. Accessibility</h2>
                    <p>
                        We are committed to ensuring digital accessibility for
                        all users. If you encounter accessibility barriers,
                        please contact us so we can assist.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>10. Contact Us</h2>
                    <p>
                        If you have questions about this Privacy Policy, please
                        contact us through the support options in the website.
                    </p>
                </section>
            </div>
        </div>
    );
}
