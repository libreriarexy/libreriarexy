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
            className="h-10 w-full rounded-xl border-2 border-white/10 bg-[#122241] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#facc15] shadow-sm transition-all focus:border-[#facc15] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
        >
            <option value="PENDING" className="bg-white text-[#122241] font-bold">Pendiente</option>
            <option value="PREPARED" className="bg-white text-[#122241] font-bold">Preparado</option>
            <option value="DELIVERED" className="bg-white text-[#122241] font-bold">Entregado</option>
            <option value="CANCELLED" className="bg-white text-[#122241] font-bold">Cancelado</option>
        </select>
    );
}
