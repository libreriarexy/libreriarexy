"use server";

import { db } from "@/lib/db";
import { Order } from "@/types";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";

export async function updateOrderStatus(orderId: string, status: Order['status']) {
    try {
        const order = (await db.getOrders()).find(o => o.id === orderId);
        if (!order) return { success: false, error: "Pedido no encontrado" };

        if (status === "CANCELLED" && order.status !== "CANCELLED") {
            // Reintegrate Stock
            for (const item of order.items) {
                await db.updateStock(item.productId, item.quantity); // Positive delta adds stock
            }
        }

        // Logic for deducting if re-opening cancelled order? 
        // For now assuming we don't allow un-cancelling or it's manual.

        await db.updateOrderStatus(orderId, status);

        // Email Notification
        if (order.userEmail) {
            const subject = `Actualización de Pedido #${order.id.slice(0, 8)}`;
            const html = `
            <h1>Su pedido ha cambiado de estado</h1>
            <p>El estado de su pedido es ahora: <strong>${status}</strong></p>
            <p>Gracias por elegirnos.</p>
        `;
            await sendEmail(order.userEmail, subject, html);
        }

        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error) {
        console.error("Error updating order:", error);
        return { success: false, error: "Error al actualizar pedido" };
    }
}
