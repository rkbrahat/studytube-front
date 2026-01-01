import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility Function: cn (ClassName)
 * Combines 'clsx' (conditionals) and 'tailwind-merge' (conflict resolution).
 * This ensures that if we pass 'bg-red-500' via props, it properly overrides a default 'bg-blue-500'.
 */
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * NeonButton Component
 * 
 * A reusable atomic component for all primary interactions.
 * It features a custom "Neon" aesthetic with glow effects and hover animations.
 * 
 * Props:
 * @param {string} variant - Determines visual style ('primary', 'secondary', 'danger').
 * @param {boolean} isLoading - Shows a spinner and disables clicks if true.
 * @param {Function} onClick - Handler for click events.
 * @param {ReactNode} children - The content inside the button.
 */
const NeonButton = ({
    children,
    onClick,
    className,
    variant = 'primary',
    isLoading = false,
    ...props
}) => {

    // Base styles applied to all buttons: 
    // - Monospaced font for tech feel
    // - Relative position to contain absolute children (scanlines)
    // - Overflow hidden to clip the scanline animation
    const baseStyles = "relative px-6 py-2 rounded-md font-mono font-medium transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group";

    // Variant definitions: mapping logic to specific Tailwind classes
    const variants = {
        // Primary: The main "Emerald" glow look.
        primary: "bg-surface border border-primary text-primary hover:bg-primary hover:text-black shadow-[0_0_10px_rgba(0,224,142,0.2)] hover:shadow-[0_0_20px_rgba(0,224,142,0.6)]",

        // Secondary: A subtle ghost button for less important actions.
        secondary: "bg-transparent border border-text-main/20 text-text-main hover:border-text-main/50 hover:text-primary hover:bg-text-main/5",

        // Danger: For destructive actions like deleting a course.
        danger: "bg-surface border border-red-500 text-red-500 hover:bg-red-500 hover:text-white shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
    };

    return (
        // Motion.button: Using Framer Motion for smooth micro-interactions (scale on click/hover)
        <motion.button
            whileHover={{ scale: 1.02 }} // Slight growth on hover
            whileTap={{ scale: 0.98 }}   // Slight shrink on click (tactile feel)
            className={cn(baseStyles, variants[variant], className)}
            onClick={!isLoading ? onClick : undefined} // Prevent clicks while loading
            disabled={isLoading}
            {...props}
        >
            {/* Decorative Element: A "scanline" that slides up on hover for a high-tech effect */}
            <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

            {/* Content wrapper: Keeps text above the decorative background */}
            <span className="relative z-10 flex items-center gap-2">
                {/* Loading Spinner: Conditionally rendered */}
                {isLoading && <span className="animate-spin">⟳</span>}
                {children}
            </span>
        </motion.button>
    );
};

export default NeonButton;
