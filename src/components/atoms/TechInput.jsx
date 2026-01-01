import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes safely
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * TechInput Component
 * 
 * A customized input field designed for the tech/dark theme.
 * Instead of standard browser borders, it uses subtle transparency and glowing states.
 * 
 * Props:
 * @param {string} label - Optional label text displayed above the input.
 * @param {string} error - Error message displayed below the input (triggers red border).
 */
const TechInput = ({ label, className, error, ...props }) => {
    return (
        // Container handles vertical spacing for label, input, and error message
        <div className="w-full space-y-1">

            {/* Label: Only rendered if provided. Uses monospace font for consistency. */}
            {label && (
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider ml-1">
                    {label}
                </label>
            )}

            {/* Input Wrapper: Needed for potential absolute positioning of icons later */}
            <div className="relative group">
                <input
                    className={cn(
                        // --- Default Styles ---
                        // bg-surface/50: 50% opacity background for depth.
                        // border-text-main/20: Subtle border, visible in both modes.
                        "w-full bg-surface/50 border border-text-main/20 rounded-md px-4 py-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/80 transition-all duration-300 font-sans",

                        // --- Focus State ---
                        // Adds a glow shadow matching the primary color.
                        "focus:shadow-[0_0_15px_rgb(var(--primary-glow)/0.1)]",

                        // --- Error State ---
                        // Overrides border and glow color to red if an error exists.
                        error && "border-red-500 focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.1)]",
                        className
                    )}
                    {...props}
                />
            </div>

            {/* Error Message: Rendered in red below the input */}
            {error && (
                <p className="text-red-500 text-xs ml-1">{error}</p>
            )}
        </div>
    );
};

export default TechInput;
