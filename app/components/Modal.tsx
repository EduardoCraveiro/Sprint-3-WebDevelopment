"use client";

import { useEffect, useRef } from "react";

export function Modal({ label, onClose, children }: { label: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return <dialog ref={ref} className="modal-backdrop" aria-label={label} onCancel={(event) => { event.preventDefault(); onClose(); }}>{children}</dialog>;
}
