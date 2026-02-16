/**
 * Logging utility for the application
 * Provides environment-aware logging that can be disabled in production
 */

class Logger {
    private isDevelopment: boolean

    constructor() {
        // In Vite, we use import.meta.env
        this.isDevelopment = import.meta.env.DEV
    }

    formatMessage(level: string, message: string, data?: any) {
        return {
            level,
            message,
            data: data ? this.sanitizeData(data) : undefined,
            timestamp: new Date().toISOString(),
        }
    }

    /**
     * Sanitize data to remove sensitive information
     */
    sanitizeData(data: any): any {
        if (typeof data !== "object" || data === null) {
            return data
        }

        if (data instanceof Error) {
            return {
                ...data, // custom properties
                message: data.message,
                stack: data.stack,
                name: data.name,
            }
        }

        const sensitiveKeys = ["password", "token", "secret", "key", "authorization", "cookie"]
        if (Array.isArray(data)) {
            return data.map(item => this.sanitizeData(item))
        }

        const sanitized: any = { ...data }

        for (const key in sanitized) {
            if (sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))) {
                sanitized[key] = "[REDACTED]"
            } else if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
                sanitized[key] = this.sanitizeData(sanitized[key])
            }
        }

        return sanitized
    }

    /**
     * Log debug messages (only in development)
     */
    debug(message: string, data?: any) {
        if (this.isDevelopment) {
            const entry = this.formatMessage("debug", message, data)
            console.debug(`[DEBUG] ${entry.timestamp} - ${entry.message}`, entry.data || "")
        }
    }

    /**
     * Log info messages
     */
    info(message: string, data?: any) {
        if (this.isDevelopment) {
            const entry = this.formatMessage("info", message, data)
            console.info(`[INFO] ${entry.timestamp} - ${entry.message}`, entry.data || "")
        }
        // In production, could send to logging service
    }

    /**
     * Log warning messages
     */
    warn(message: string, data?: any) {
        const entry = this.formatMessage("warn", message, data)
        if (this.isDevelopment) {
            console.warn(`[WARN] ${entry.timestamp} - ${entry.message}`, entry.data || "")
        }
        // In production, could send to logging service
    }

    /**
     * Log error messages
     */
    error(message: string, error?: any) {
        const entry = this.formatMessage("error", message, error)

        if (this.isDevelopment) {
            console.error(`[ERROR] ${entry.timestamp} - ${entry.message}`, entry.data || "")
        } else {
            // In production, send to error tracking service (e.g., Sentry)
            // For now, silently log (could be extended to send to external service)
        }
    }

    /**
     * Log debug messages with context
     */
    debugWithContext(context: string, message: string, data?: any) {
        this.debug(`${context}: ${message}`, data)
    }

    /**
     * Log info messages with context
     */
    infoWithContext(context: string, message: string, data?: any) {
        this.info(`${context}: ${message}`, data)
    }

    /**
     * Log warning messages with context
     */
    warnWithContext(context: string, message: string, data?: any) {
        this.warn(`${context}: ${message}`, data)
    }

    /**
     * Log errors with context (for API routes and services)
     */
    errorWithContext(context: string, message: string, error: any) {
        this.error(`${context}: ${message}`, error)
    }
}

// Export singleton instance
export const logger = new Logger()

// Export default for convenience
export default logger
