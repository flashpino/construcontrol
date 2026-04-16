import * as React from "react"
import Modal from '@/Components/Modal';
import { cn } from "@/lib/utils"

const Dialog = ({ open, onOpenChange, children }) => (
  <Modal show={open} onClose={() => onOpenChange(false)} maxWidth="md">
    {children}
  </Modal>
);

const DialogContent = ({ children, className }) => (
  <div className={cn("relative", className)}>{children}</div>
);

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left p-6", className)}
    {...props}
  />
);

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 bg-slate-50/50 border-t border-slate-100", className)}
    {...props}
  />
);

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
