"use client";

import { User } from "@/types";
import { toggleUserApproval } from "@/app/actions/users";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export function UserApprovalButton({ user }: { user: User }) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            await toggleUserApproval(user.id, !user.approved);
        });
    };

    return (
        <Button
            variant={user.approved ? "outline" : "default"}
            size="sm"
            onClick={handleToggle}
            disabled={isPending}
            className={user.approved ? "text-green-600 border-green-200 hover:bg-green-50" : ""}
        >
            {user.approved ? (
                <>
                    <CheckCircle className="mr-2 h-4 w-4" /> Aprobado
                </>
            ) : (
                <>
                    <XCircle className="mr-2 h-4 w-4" /> Pendiente
                </>
            )}
        </Button>
    );
}
