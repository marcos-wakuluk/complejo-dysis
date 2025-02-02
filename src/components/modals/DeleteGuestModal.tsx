import { Modal, Button, Group, Text } from "@mantine/core";

interface DeleteGuestModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

const DeleteGuestModal: React.FC<DeleteGuestModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal opened={isOpen} onClose={onClose} title="Eliminar Invitado" centered>
      <Text>¿Estás seguro de que deseas eliminar este invitado?</Text>
      <Group justify="center" mt="md">
        <Button onClick={onClose} variant="outline">
          Cancelar
        </Button>
        <Button color="red" onClick={onConfirm}>
          Eliminar
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteGuestModal;
