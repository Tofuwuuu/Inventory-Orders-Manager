"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({ title, onConfirm, label = "Delete" }: { title: string; onConfirm: () => Promise<void> | void; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="inline-flex items-center gap-2">
      <Button type="button" className="bg-red-600 hover:bg-red-500" onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open && (
        <div className="fixed inset-0 grid place-items-center bg-black/50">
          <div className="w-full max-w-sm rounded-md bg-white p-4">
            <p className="mb-3 text-sm">{title}</p>
            <div className="flex justify-end gap-2">
              <Button type="button" className="bg-zinc-400 hover:bg-zinc-500" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="button" className="bg-red-600 hover:bg-red-500" onClick={async () => { await onConfirm(); setOpen(false); }}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
