import { DatabaseAdapter, Product, User, Order } from "@/types";
import { google } from "googleapis";

// Configuración de columnas esperada en Google Sheets
// Hoja: 'Productos'
// A: ID
// B: Nombre
// C: Descripción
// D: Precio
// E: Stock
// F: Categoría
// G: Imagen URL
// H: Activo (TRUE/FALSE)

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getAuth() {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
        throw new Error("Faltan credenciales de Google Sheets");
    }

    return new google.auth.GoogleAuth({
        credentials: {
            client_email: clientEmail,
            private_key: privateKey,
        },
        scopes: SCOPES,
    });
}

export const googleSheetsDb: DatabaseAdapter = {
    // --- Productos ---
    async getProducts() {
        try {
            const auth = getAuth();
            const sheets = google.sheets({ version: 'v4', auth });

            const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
            console.log("Fetching from Spreadsheet ID:", spreadsheetId ? "DEFINED" : "UNDEFINED");
            const range = 'Productos!A2:I'; // ID, Nombre, Desc, Precio, Stock, Cat, Imagen, Activo, Detalle

            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });

            const rows = response.data.values;
            if (!rows || rows.length === 0) return [];

            return rows.map((row) => {
                const imageString = row[6] || "";
                const allImages = imageString.split(',').map((s: string) => s.trim()).filter(Boolean);

                return {
                    id: row[0] || crypto.randomUUID(),
                    name: row[1] || "Sin Nombre",
                    description: row[2] || "",
                    price: parseFloat(row[3]?.replace(/[^0-9.-]+/g, "")) || 0,
                    stock: parseInt(row[4]) || 0,
                    category: row[5] || "General",
                    imageUrl: allImages[0] || "",
                    images: allImages.slice(1),
                    active: row[7] === "TRUE",
                    details: row[8] || "",
                };
            });
        } catch (error) {
            console.error("Error fetching products from Sheets:", error);
            return [];
        }
    },

    async getProduct(id: string) {
        const products = await this.getProducts();
        return products.find(p => p.id === id) || null;
    },

    async updateStock(productId: string, delta: number) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(p => p.id === productId);
            if (index === -1) return false;

            const rowNumber = index + 2; // +1 for 0-indexed, +1 for headers
            const auth = getAuth();
            const sheets = google.sheets({ version: 'v4', auth });

            // Get current stock to be safe, or just trust the delta?
            // Safer to just update based on the sheet's current value?
            // For now, simple update in sheet cell E (Col 4)
            const currentStock = products[index].stock;
            const newStock = Math.max(0, currentStock + delta);

            await sheets.spreadsheets.values.update({
                spreadsheetId: process.env.GOOGLE_SHEETS_ID,
                range: `Productos!E${rowNumber}`,
                valueInputOption: 'RAW',
                requestBody: { values: [[newStock]] }
            });
            return true;
        } catch (error) {
            console.error("Error updating stock in Sheets:", error);
            return false;
        }
    },

    // --- Usuarios (Lectura básica, Escritura compleja omitida por brevedad en este paso) ---
    // --- Usuarios ---
    // Hoja: 'Usuarios'
    // A: ID, B: Email, C: Name, D: Role, E: Balance, F: Approved, G: CreatedAt, H: Address, I: Phone

    async getUsers() {
        try {
            const auth = getAuth();
            const sheets = google.sheets({ version: 'v4', auth });
            const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
            const range = 'Usuarios!A2:J';

            const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
            const rows = response.data.values;
            if (!rows || rows.length === 0) return [];

            return rows.map((row) => ({
                id: row[0],
                email: row[1],
                name: row[2],
                role: row[3] as any,
                balance: parseFloat(row[4]) || 0,
                approved: row[5] === "TRUE",
                createdAt: row[6],
                address: row[7] || "",
                phone: row[8] || "",
                password: row[9] || "",
            }));
        } catch (error) {
            console.error("Error get users:", error);
            return [];
        }
    },

    async getUserByEmail(email: string) {
        // 1. Check Hardcoded Admin
        if (email === "admin@webrexy.com") {
            return {
                id: "u1",
                email: "admin@webrexy.com",
                name: "Administrador",
                role: "ADMIN",
                balance: 0,
                approved: true,
                createdAt: new Date().toISOString(),
                address: "Oficina Central",
                phone: "000-0000",
                password: "admin", // Demo password
            } as User;
        }

        // 2. Check Sheets
        const users = await this.getUsers();
        return users.find(u => u.email === email) || null;
    },

    async createUser(user: User) {
        try {
            const auth = getAuth();
            const sheets = google.sheets({ version: 'v4', auth });
            const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: 'Usuarios!A:J',
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [[
                        user.id,
                        user.email,
                        user.name,
                        user.role,
                        user.balance,
                        user.approved ? "TRUE" : "FALSE",
                        user.createdAt,
                        user.address || "",
                        user.phone || "",
                        user.password || ""
                    ]]
                }
            });
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    async updateUser(user: User) {
        try {
            const auth = getAuth();
            const sheets = google.sheets({ version: 'v4', auth });
            const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

            const users = await this.getUsers();
            const index = users.findIndex(u => u.id === user.id);
            if (index === -1) return;

            const rowNumber = index + 2;

            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `Usuarios!A${rowNumber}:J${rowNumber}`,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [[
                        user.id,
                        user.email,
                        user.name,
                        user.role,
                        user.balance,
                        user.approved ? "TRUE" : "FALSE",
                        user.createdAt,
                        user.address || "",
                        user.phone || "",
                        user.password || ""
                    ]]
                }
            });
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },

    async updateUserBalance(userId: string, delta: number) {
        // Implementación simplificada
    },
    async toggleUserApproval(userId: string, approved: boolean) {
        try {
            const auth = getAuth();
            const sheets = google.sheets({ version: 'v4', auth });
            const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

            const users = await this.getUsers();
            const userIndex = users.findIndex(u => u.id === userId);

            if (userIndex === -1) return;

            const rowNumber = userIndex + 2;

            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `Usuarios!F${rowNumber}`,
                valueInputOption: 'USER_ENTERED',
                requestBody: { values: [[approved ? "TRUE" : "FALSE"]] }
            });

            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `Usuarios!D${rowNumber}`,
                valueInputOption: 'USER_ENTERED',
                requestBody: { values: [[approved ? "CLIENT" : "PENDING"]] }
            });

        } catch (error) {
            console.error("Error toggle user approval:", error);
        }
    },

    // --- Pedidos ---
    // Hoja: 'Pedidos'
    // A: ID, B: UserID, C: UserEmail, D: Total, E: Status, F: CreatedAt, G: Items(JSON)

    async getOrders() {
        try {
            const auth = getAuth();
            const sheets = google.sheets({ version: 'v4', auth });
            const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
            const range = 'Pedidos!A2:G';

            const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
            const rows = response.data.values;
            if (!rows || rows.length === 0) return [];

            return rows.map((row) => ({
                id: row[0],
                userId: row[1],
                userEmail: row[2],
                total: parseFloat(row[3]) || 0,
                status: row[4] as any,
                createdAt: row[5],
                updatedAt: row[5], // Map createdAt to updatedAt for now
                items: JSON.parse(row[6] || "[]"),
            }));
        } catch (error) {
            console.error("Error get orders:", error);
            return [];
        }
    },

    async getOrdersByUser(userId: string) {
        const orders = await this.getOrders();
        return orders.filter(o => o.userId === userId);
    },

    async createOrder(order: Order) {
        try {
            const auth = getAuth();
            const sheets = google.sheets({ version: 'v4', auth });
            const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: 'Pedidos!A:G',
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [[
                        order.id,
                        order.userId,
                        order.userEmail,
                        order.total,
                        order.status,
                        order.createdAt,
                        JSON.stringify(order.items)
                    ]]
                }
            });
            return order.id;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    },

    async updateOrderStatus(orderId: string, status: Order['status']) {
        try {
            const orders = await this.getOrders();
            const index = orders.findIndex(o => o.id === orderId);
            if (index === -1) return;

            const rowNumber = index + 2;
            const auth = getAuth();
            const sheets = google.sheets({ version: 'v4', auth });

            await sheets.spreadsheets.values.update({
                spreadsheetId: process.env.GOOGLE_SHEETS_ID,
                range: `Pedidos!E${rowNumber}`,
                valueInputOption: 'USER_ENTERED',
                requestBody: { values: [[status]] }
            });
        } catch (error) {
            console.error("Error updating order status in Sheets:", error);
        }
    }
};
