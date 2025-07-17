import { cn } from "@/lib/utils";
import * as React from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  const [isOpen, setIsOpen] = React.useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = () => {
    setIsOpen(false);
    onOpenChange(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const DialogTrigger: React.FC<{
  children: React.ReactNode;
  asChild?: boolean;
}> = ({ children, asChild }) => {
  return <>{children}</>;
};

const DialogContent: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div
    className={cn(
      "bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4",
      className,
    )}
  >
    {children}
  </div>
);

const DialogHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="mb-4">{children}</div>;

const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

const DialogDescription: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <p className="text-sm text-gray-600 mt-1">{children}</p>;

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
};
