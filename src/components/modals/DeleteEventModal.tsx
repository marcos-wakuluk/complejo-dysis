import { Modal, Button, Text, Group } from "@mantine/core";

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventName: string;
}

export function DeleteEventModal({ isOpen, onClose, onConfirm, eventName }: DeleteEventModalProps) {
  return (
    <Modal opened={isOpen} onClose={onClose} title="Confirmar eliminacion" centered>
      <Text>Esta seguro que quiere eliminar el evento {eventName}?</Text>
      <Group justify="center" mt="md">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button color="red" onClick={onConfirm}>
          Eliminar
        </Button>
      </Group>
    </Modal>
  );
}
