import { useState } from "react";
import { Modal, TextInput, Button, Group } from "@mantine/core";
import { Guest } from "@/types/Guest";

interface EditGuestModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly guest: Guest;
  readonly onSave: (guest: Guest) => void;
}

const EditGuestModal: React.FC<EditGuestModalProps> = ({ isOpen, onClose, guest, onSave }) => {
  const [name, setName] = useState(guest.name);
  const [dni, setDni] = useState(guest.dni);
  const [age, setAge] = useState(guest.age);
  const [phone, setPhone] = useState(guest.phone);
  const [instagram, setInstagram] = useState(guest.instagram);
  const [status, setStatus] = useState(guest.status);

  const handleSave = () => {
    const updatedGuest = {
      ...guest,
      name,
    };
    onSave(updatedGuest);
    onClose();
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Editar Invitado" centered>
      <TextInput label="Nombre" value={name} onChange={(e) => setName(e.currentTarget.value)} required />
      <TextInput label="DNI" value={dni} onChange={(e) => setDni(e.currentTarget.value)} required />
      <TextInput label="Edad" value={age} onChange={(e) => setAge(Number(e.currentTarget.value))} required />
      <TextInput label="Telefono" value={phone} onChange={(e) => setPhone(e.currentTarget.value)} required />
      <TextInput label="Instagram" value={instagram} onChange={(e) => setInstagram(e.currentTarget.value)} required />
      <TextInput label="Estado" value={status} onChange={(e) => setStatus(e.currentTarget.value)} required />
      <Group justify="center" mt="md">
        <Button onClick={onClose} color="red" variant="outline">
          Cancelar
        </Button>
        <Button onClick={handleSave}>Guardar</Button>
      </Group>
    </Modal>
  );
};

export default EditGuestModal;
