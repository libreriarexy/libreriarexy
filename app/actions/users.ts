"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleUserApproval(userId: string, approve: boolean) {
    try {
        await db.toggleUserApproval(userId, approve);
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Error toggling user approval:", error);
        return { success: false, error: "Failed to update user." };
    }
}

export async function updateUserBalance(userId: string, delta: number) {
    try {
        await db.updateUserBalance(userId, delta);
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update balance." };
    }
}
