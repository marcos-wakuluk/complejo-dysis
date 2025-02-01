import { Modal, Text, Button, Group } from "@mantine/core";
import { User } from "../../types/User";

interface DeleteUserModalProps {
  readonly opened: boolean;
  readonly onClose: () => void;
  readonly user: User | null;
  readonly onDelete: () => void;
}

export function DeleteUserModal({ opened, onClose, user, onDelete }: DeleteUserModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Confirmar eliminación" centered size="sm">
      <Text size="sm" mb="lg">
        ¿Estás seguro que deseas eliminar a {user?.name} {user?.lastname}?
      </Text>
      <Group justify="center">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button color="red" onClick={onDelete}>
          Eliminar
        </Button>
      </Group>
    </Modal>
  );
}
