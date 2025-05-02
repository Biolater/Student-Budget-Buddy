import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@heroui/react";

type DeleteExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  isDeleting: boolean;
};

const DeleteExpenseModal: React.FC<DeleteExpenseModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  isDeleting,
}) => {
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="auto"
      onOpenChange={onClose}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex-col space-y-1.5">
              <p>Delete Expense</p>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this expense? This action cannot
                be undone.
              </p>
            </ModalHeader>
            <ModalFooter>
              <Button variant="light" onPress={onCloseModal}>
                Close
              </Button>
              <Button
                isDisabled={isDeleting}
                isLoading={isDeleting}
                color="danger"
                onPress={onDelete}
              >
                Delete Expense
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};


export default DeleteExpenseModal;