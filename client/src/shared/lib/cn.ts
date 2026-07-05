/**
 * Tiny classNames helper for conditional CSS class composition.
 * Accepts strings, falsy values (ignored), or a record of { className: condition }.
 */
export type ClassValue = string | number | null | undefined | false | Record<string, boolean>;

export function cn(...values: ClassValue[]): string {
    const classes: string[] = [];

    for (const value of values) {
        if (!value) {
            continue;
        }

        if (typeof value === "string" || typeof value === "number") {
            classes.push(String(value));
            continue;
        }

        for (const [key, active] of Object.entries(value)) {
            if (active) {
                classes.push(key);
            }
        }
    }

    return classes.join(" ");
}
