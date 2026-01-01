import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes safely
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * StatusBadge Component
 * 
 * A small UI element ("pill") used to display the state of an item.
 * Commonly used for course status (Active, Completed) or order status.
 * 
 * Props:
 * @param {string} status - The text string to display (also determines color).
 * @param {string} className - Optional overrides.
 */
const StatusBadge = ({ status, className }) => {

    /**
     * Helper function to determine color scheme based on status text.
     * Returns a string of Tailwind classes.
     */
    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            // SUCCESS States: Green/Primary
            case 'completed':
            case 'success':
                return "bg-primary/10 text-primary border-primary/20";

            // WARNING States: Yellow/Orange
            case 'in progress':
            case 'active':
            case 'warning':
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";

            // NEUTRAL States: Gray
            case 'pending':
            case 'inactive':
                return "bg-gray-500/10 text-gray-400 border-gray-500/20";

            // ERROR States: Red
            case 'error':
            case 'rejected':
                return "bg-red-500/10 text-red-500 border-red-500/20";

            // Default fallback
            default:
                return "bg-surface text-text-muted border-white/10";
        }
    };

    return (
        // Render as a span with inline-block behavior.
        // font-mono and uppercase give it a "technical tag" look.
        <span className={cn(
            "px-2 py-1 rounded text-[10px] font-mono tracking-wider uppercase border",
            getStatusStyles(status), // Apply dynamic colors
            className
        )}>
            {status}
        </span>
    );
};

export default StatusBadge;
