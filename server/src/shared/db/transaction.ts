import { Database } from "@db";
import { Transaction } from "sequelize";

/**
 * Runs `work` inside a managed transaction: commits on success, rolls back on
 * any throw. Use in services for multi-step writes that must be atomic.
 */
export function withTransaction<T>(
    work: ( t: Transaction ) => Promise<T>,
): Promise<T> {
    return Database.transaction( work );
}
