"use client";

import { Order } from "@/types";
import { updateOrderStatus } from "@/app/actions/admin";
import { useTransition } from "react";
import { toast } from "@/components/ui/use-toast-simplified";

// Assuming Select component exists or I need to create it. 
// I haven't created Select component yet. I will use native select or create it.
// Native select is faster.

export function OrderStatusSelector({ order }: { order: Order }) {
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as Order['status'];
        startTransition(async () => {
            const res = await updateOrderStatus(order.id, newStatus);
            if (res.success) {
                toast({ title: "Estado actualizado", description: `Pedido ahora está ${newStatus}` });
            } else {
                toast({ title: "Error", description: "No se pudo actualizar." });
            }
        });
    };

    return (
        <select
            disabled={isPending}
            value={order.status}
            onChange={handleChange}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
            <option value="PENDING">Pendiente</option>
            <option value="PREPARED">Preparado</option>
            <option value="DELIVERED">Entregado</option>
            <option value="CANCELLED">Cancelado</option>
        </select>
    );
}
