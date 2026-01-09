import { Product, User, Order, DatabaseAdapter } from "@/types";
import { mockDb } from "./mock";
import { googleSheetsDb } from "./sheets";

// Factory to switch implementations
class DatabaseFactory {
    getAdapter(): DatabaseAdapter {
        // Switch to Sheets if env var says so, otherwise Mock
        const useSheets = process.env.USE_GOOGLE_SHEETS === "true";
        console.log("--- DB INIT ---");
        console.log("USE_GOOGLE_SHEETS env var:", process.env.USE_GOOGLE_SHEETS);
        console.log("Using Adapter:", useSheets ? "GOOGLE SHEETS" : "MOCK DB");
        if (useSheets) {
            return googleSheetsDb;
        }
        return mockDb;
    }
}

export const db = new DatabaseFactory().getAdapter();
