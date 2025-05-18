"use client";
import React, { useState } from "react";
import styles from "./FAQ.module.css";

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "How does the ad-free viewing work?",
            answer: "Our player loads YouTube videos directly while skipping ads and distractions, giving you just the content you want to watch.",
        },
        {
            question: "Can I import my existing YouTube playlists?",
            answer: "Yes! Just paste your public playlist URL and we'll import all videos while maintaining their original order.",
        },
        {
            question: "What happens if a video gets deleted from YouTube?",
            answer: "Deleted or private videos will show as unavailable in your playlists, but all other videos will remain accessible.",
        },
        {
            question: "Is there a limit to how many playlists I can create?",
            answer: "You can create unlimited playlists and save as many videos as you want - we don't impose arbitrary limits.",
        },
        {
            question: "Can I share my custom playlists with others?",
            answer: "Absolutely! Each public playlist has a shareable link that works even for people without an account.",
        },
        {
            question: "Can I use this on my TV or streaming device?",
            answer: "While we're web-based, you can cast from your device or use a browser on smart TVs for full-screen viewing.",
        },
        {
            question: "How often is new functionality added?",
            answer: "We release updates every 2-3 weeks based on user feedback. You can suggest features through our feedback system.",
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
