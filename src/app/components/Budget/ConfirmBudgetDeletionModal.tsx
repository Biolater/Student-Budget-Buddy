import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/react";

interface ConfirmBudgetDeletionModalProps {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const ConfirmBudgetDeletionModal: React.FC<ConfirmBudgetDeletionModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  isDeleting,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Confirm Budget Deletion</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete this budget?</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            isLoading={isDeleting}
            onPress={onDelete}
            isDisabled={isDeleting}
          >
            Delete
          </Button>
          <Button
            isDisabled={isDeleting}
            color="secondary"
            onPress={() => onClose(false)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmBudgetDeletionModal;
