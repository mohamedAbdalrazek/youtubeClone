"use client"
import React, { useState } from "react";
import styles from "./FAQ.module.css";

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "Is Streamura free to use?",
            answer: "Yes! Streamura is completely free with no hidden costs.",
        },
        {
            question: "Do I need to create an account?",
            answer: "Only if you want to save playlists. Watching videos requires no login.",
        },
        {
            question: "Is this legal?",
            answer: "Streamura operates within fair use guidelines by not hosting content directly.",
        },
    ];

    return (
        <section className={styles.faqSection}>
            <div className="container">
                <h2 className={styles.sectionTitle}>
                    Frequently Asked Questions
                </h2>

                <div className={styles.faqContainer}>
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`${styles.faqItem} ${
                                activeIndex === index ? styles.active : ""
                            }`}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className={styles.faqHeader}>
                                <h3 className={styles.faqQuestion}>
                                    {faq.question}
                                </h3>
                                <span className={styles.faqToggle}>
                                    {activeIndex === index ? "−" : "+"}
                                </span>
                            </div>
                            <div className={styles.faqAnswer}>
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
