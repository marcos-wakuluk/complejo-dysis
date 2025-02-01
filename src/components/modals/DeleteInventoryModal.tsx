import { Modal, Button, Text, Group } from "@mantine/core";

interface DeleteInventoryModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly itemName: string;
}

export function DeleteInventoryModal({ isOpen, onClose, onConfirm, itemName }: DeleteInventoryModalProps) {
  return (
    <Modal opened={isOpen} onClose={onClose} title="Confirmar Eliminación" centered>
      <Text>¿Está seguro que quiere eliminar el ítem {itemName}?</Text>
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
