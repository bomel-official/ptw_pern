// Global test setup. Provide deterministic env for security-sensitive helpers
// so JWT signing/verification round-trips in tests.
process.env.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "test-secret-key";
