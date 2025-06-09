import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Dispatch, ReactNode, SetStateAction } from 'react';

interface AlertDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  confirmButtonClass?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // children: ReactNode;
}

const AlertDialogComponent = ({
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  open = false,
  setOpen,
  confirmButtonClass = 'bg-red-600 text-white hover:bg-red-700',
}: // children, // Default style
AlertDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={value => setOpen(value)}>
      {/* <AlertDialogTrigger asChild>{children}</AlertDialogTrigger> */}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className={confirmButtonClass}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogComponent;
