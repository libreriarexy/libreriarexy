"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Simplified Select for speed - wrapping native select for now if valid, 
// BUT my code imported Select, SelectContent, etc. which implies Radix UI structure.
// To avoid installing Radix and dealing with complex UI code now, I will fake the exports 
// but render a native select internally or just a simple div structure if I can't match logic.

// Actually, `order-status-selector.tsx` uses:
// Select, SelectContent, SelectItem, SelectTrigger, SelectValue
// I will create a dummy implementation that just renders a native select if possible, 
// OR I will rewriting `order-status-selector.tsx` to use native select (which I did in step 148: `return <select ...>`).
// WAIT. Step 148 code:
/*
export function OrderStatusSelector({ order }: { order: Order }) {
  // ...
  return (
    <select ...>
       ...
    </select>
  );
}
*/
// BUT it also had imports:
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// AND they were unused if I used native select ???
// Let's check `components/admin/order-status-selector.tsx` content from step 148.

// It imported them but didn't use them? OR did I mix it up?
// The code I wrote in step 148:
/*
import { Order } from "@/types";
import { updateOrderStatus } from "@/app/actions/admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // UNUSED
import { useTransition } from "react";
import { toast } from "@/components/ui/use-toast-simplified";

export function OrderStatusSelector({ order }: { order: Order }) {
  // ...
  return (
    <select ...>
*/
// So I have unused imports. I should remove them from `order-status-selector.tsx` and I DON'T need `components/ui/select.tsx`.

/*
Plan:
1. Fix `order-status-selector.tsx` (Remove unused imports).
2. Create `table.tsx` (Admin Users Page uses it). 
   Actually, let's check `app/admin/users/page.tsx` (Step 118 viewed code).
   It used:
   <div className="rounded-md border">
     <table className="w-full text-sm text-left">
   It used native table tags!
   Wait, the lint error said: `No se encuentra el módulo "@/components/ui/table"`.
   Maybe I imported it but didn't use it, or I used `Table`, `TableHeader` etc in a previous version or thinking I did.
   Ref Step 118:
   `export default async function UsersPage() { ... <table ...`
   It does NOT seem to import Table components in the snippet I saw.
   But the lint error persists.
   Maybe the user context has a version of the file I didn't verify fully.
   I will create `components/ui/table.tsx` just in case to satisfy any zombie imports.
*/

const Table = React.forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
        <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
        />
    </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
    />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
            className
        )}
        {...props}
    />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
            className
        )}
        {...props}
    />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
            className
        )}
        {...props}
    />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
        {...props}
    />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn("mt-4 text-sm text-muted-foreground", className)}
        {...props}
    />
))
TableCaption.displayName = "TableCaption"

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
}
