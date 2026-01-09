import { DatabaseAdapter, Order, Product, User } from "@/types";

// Initial Mock Data
let PRODUCTS: Product[] = [
    {
        id: "p1",
        name: "Cuaderno Premium A4",
        description: "Cuaderno de tapa dura, 100 hojas, papel ahuesado.",
        price: 4500,
        stock: 50,
        category: "Papelería",
        imageUrl: "https://placehold.co/400?text=Cuaderno+A4",
        active: true,
        cost: 2500,
    },
    {
        id: "p2",
        name: "Bolígrafo Gel Negro",
        description: "Punta 0.5mm, tinta de secado rápido.",
        price: 1200,
        stock: 200,
        category: "Escritura",
        imageUrl: "https://placehold.co/400?text=Boligrafo",
        active: true,
        cost: 600,
    },
    {
        id: "p3",
        name: "Mochila Escolar",
        description: "Resistente al agua, múltiples bolsillos.",
        price: 25000,
        stock: 10,
        category: "Accesorios",
        imageUrl: "https://placehold.co/400?text=Mochila",
        active: true,
        cost: 15000,
    },
];

let USERS: User[] = [
    {
        id: "u1",
        email: "admin@webrexy.com",
        name: "Administrador",
        role: "ADMIN",
        balance: 0,
        approved: true,
        createdAt: new Date().toISOString(),
        address: "Oficina Central",
        phone: "000-0000",
        password: "admin",
    },
    {
        id: "u2",
        email: "cliente@demo.com",
        name: "Cliente Demo",
        role: "CLIENT",
        balance: 5000,
        approved: true,
        createdAt: new Date().toISOString(),
        password: "password",
    },
    {
        id: "u3",
        email: "nuevo@demo.com",
        name: "Usuario Pendiente",
        role: "PENDING",
        balance: 0,
        approved: false,
        createdAt: new Date().toISOString(),
        password: "password",
    },
];

let ORDERS: Order[] = [];

// Helper to simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockDb: DatabaseAdapter = {
    async getProducts() {
        await delay(100);
        return [...PRODUCTS];
    },

    async getProduct(id: string) {
        await delay(50);
        return PRODUCTS.find((p) => p.id === id) || null;
    },

    async updateStock(productId: string, delta: number) {
        await delay(100);
        const product = PRODUCTS.find((p) => p.id === productId);
        if (!product) return false;

        // Check stock if deducting
        if (delta < 0 && product.stock + delta < 0) {
            return false; // Not enough stock
        }

        product.stock += delta;
        return true;
    },

    async getUsers() {
        await delay(100);
        return [...USERS];
    },

    async getUserByEmail(email: string) {
        await delay(50);
        return USERS.find((u) => u.email === email) || null;
    },

    async createUser(user: User) {
        await delay(100);
        USERS.push(user);
    },

    async updateUser(user: User) {
        await delay(100);
        const index = USERS.findIndex(u => u.id === user.id);
        if (index !== -1) {
            USERS[index] = { ...user };
        }
    },

    async updateUserBalance(userId: string, delta: number) {
        await delay(100);
        const user = USERS.find((u) => u.id === userId);
        if (user) {
            user.balance += delta;
        }
    },

    async toggleUserApproval(userId: string, approved: boolean) {
        await delay(100);
        const user = USERS.find((u) => u.id === userId);
        if (user) {
            user.approved = approved;
            user.role = approved ? 'CLIENT' : 'PENDING';
        }
    },

    async getOrders() {
        await delay(100);
        return [...ORDERS];
    },

    async getOrdersByUser(userId: string) {
        await delay(100);
        return ORDERS.filter(o => o.userId === userId);
    },

    async createOrder(order: Order) {
        await delay(200);
        // In a real DB we would wrap this in a transaction with stock deduction
        // Here we assume stock was checked/deducted by the controller or service before calling createOrder
        ORDERS.push(order);
        return order.id;
    },

    async updateOrderStatus(orderId: string, status: Order['status']) {
        await delay(100);
        const order = ORDERS.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            order.updatedAt = new Date().toISOString();
        }
    }
};
