export type Role = 'GUEST' | 'PENDING' | 'CLIENT' | 'ADMIN';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
    images?: string[]; // Extra images list
    details?: string;   // Extended product details
    active: boolean; // Si el producto se muestra o no
    cost: number; // Costo de compra (Col J en Sheets)
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    balance: number; // Current account balance/credit
    approved: boolean; // Needs admin approval to see prices/buy
    createdAt: string;
    address?: string; // New field
    phone?: string;   // New field
    password?: string; // Store password (for demo purposes)
}

export type OrderStatus = 'PENDING' | 'PREPARED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
    productId: string;
    productName: string; // Snapshot layout display
    quantity: number;
    priceAtPurchase: number;
    costAtPurchase: number; // Snapshot of cost at time of sale
}

export interface Order {
    id: string;
    userId: string;
    userEmail: string; // Redundancia útil para sheets
    items: OrderItem[];
    total: number;
    profit: number; // Total profit of the order (Total - Costs)
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
}

export interface DatabaseAdapter {
    // Products
    getProducts(): Promise<Product[]>;
    getProduct(id: string): Promise<Product | null>;
    updateStock(productId: string, delta: number): Promise<boolean>;

    // Users
    getUsers(): Promise<User[]>;
    getUserByEmail(email: string): Promise<User | null>;
    createUser(user: User): Promise<void>;
    updateUser(user: User): Promise<void>;
    updateUserBalance(userId: string, delta: number): Promise<void>;
    toggleUserApproval(userId: string, approved: boolean): Promise<void>;

    // Orders
    getOrders(): Promise<Order[]>;
    getOrdersByUser(userId: string): Promise<Order[]>;
    createOrder(order: Order): Promise<string>; // Returns ID
    updateOrderStatus(orderId: string, status: Order['status']): Promise<void>;
}
