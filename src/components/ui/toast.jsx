// Shadcn-style toast primitives (simplified)
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const ToastContext = React.createContext(undefined);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

let idCounter = 0;

export function ToastProvider({ children, timeout = 4000 }) {
  const [toasts, setToasts] = React.useState([]);

  const dismiss = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = React.useCallback(
    (partial) => {
      const id = ++idCounter;
      const toast = {
        id,
        title: partial.title,
        description: partial.description,
        variant: partial.variant || "default",
      };
      setToasts((prev) => [...prev, toast]);
      if (timeout > 0) {
        setTimeout(() => dismiss(id), timeout);
      }
      return id;
    },
    [timeout, dismiss]
  );

  const value = React.useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-72">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "rounded-md border p-3 shadow-sm bg-white animate-in fade-in slide-in-from-top-2",
              t.variant === "destructive" && "border-red-300 bg-red-50"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                {t.title && <p className="text-sm font-semibold">{t.title}</p>}
                {t.description && (
                  <p className="text-xs text-muted-foreground">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-xs px-2 py-1 rounded hover:bg-muted"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
