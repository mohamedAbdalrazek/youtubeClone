import React from "react";
import Hero from "@/components/home/hero/Hero";
import Features from "@/components/home/features/Features";
import HowItWorks from "@/components/home/how-it-works/HowItWorks";
import FAQ from "@/components/home/FAQ/FAQ";
export default function HomePage() {
    return (
        <>
            <Hero />
            <Features />
            <HowItWorks />
            <FAQ />
        </>
    );
}
