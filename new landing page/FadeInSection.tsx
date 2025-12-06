
import React, { useRef, useEffect, ReactNode } from 'react';

interface FadeInSectionProps {
    children: ReactNode;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children }) => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            },
            {
                rootMargin: '0px',
                threshold: 0.15,
            }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div ref={sectionRef} className="fade-in-section">
            {children}
        </div>
    );
};

export default FadeInSection;
