"use client";

import { useFormStatus } from "react-dom";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Utility for merging tailwind classes */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Standard Button Component */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const { pending } = useFormStatus();
    const activeLoading = isLoading || pending;

    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    };

    const sizes = {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8 text-lg",
        icon: "h-10 w-10",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={activeLoading || disabled}
            {...props}
        >
            {activeLoading ? (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : null}
            {children}
        </button>
    );
}

/** Standard Input Component */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export function Input({ className, type, ...props }: InputProps) {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
}

/** Standard Label Component */
export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />;
}

/** Standard Textarea Component */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

export function Textarea({ className, ...props }: TextareaProps) {
    return (
        <textarea
            className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
}

/** Standard Select Component */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

export function Select({ className, children, ...props }: SelectProps) {
    return (
        <select
            className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children}
        </select>
    );
}

/** Standard Checkbox/Switch Component */
export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export function Switch({ className, label, ...props }: SwitchProps) {
    return (
        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                className={cn(
                    "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary",
                    className
                )}
                {...props}
            />
            {label && <Label>{label}</Label>}
        </div>
    );
}
