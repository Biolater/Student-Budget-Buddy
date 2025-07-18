'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { Button } from '@heroui/react';
import { useAuth } from '@/app/contexts/AuthContext';
import useRecurringTransaction from '@/app/hooks/useRecurringTransaction';

interface DeleteRecurringTransactionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string | null;
}

const DeleteRecurringTransactionModal = ({
  isOpen,
  onOpenChange,
  transactionId,
}: DeleteRecurringTransactionModalProps) => {
  const { userId } = useAuth();
  const {
    delete: { mutateAsync: deleteTx, isPending },
  } = useRecurringTransaction(userId);

  const handleDelete = async () => {
    if (!transactionId) return;
    await deleteTx(transactionId);
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete this recurring transaction?</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onPress={() => onOpenChange(false)}
            isDisabled={isPending}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={handleDelete}
            isLoading={isPending}
            isDisabled={isPending}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteRecurringTransactionModal;
