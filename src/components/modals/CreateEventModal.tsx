import React, { useState } from "react";
import { Modal, Button, TextInput, Textarea, Group } from "@mantine/core";
import { Event } from "@/types/Event";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(0);

  const handleSave = () => {
    const newEvent: Event = {
      name,
      description,
      date,
      startTime,
      numberOfPeople,
      peopleEntered: 0,
      ticketsSold: 0,
      status: "Pending",
    };
    onSave(newEvent);
    onClose();
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Crear Nuevo Evento">
      <TextInput
        label="Nombre"
        placeholder="Nombre del evento"
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        required
      />
      <TextInput
        label="Fecha"
        placeholder="Fecha del evento"
        value={date}
        onChange={(event) => setDate(event.currentTarget.value)}
        required
      />
      <TextInput
        label="Hora de inicio"
        placeholder="Hora de inicio del evento"
        value={startTime}
        onChange={(event) => setStartTime(event.currentTarget.value)}
        required
      />
      <Textarea
        label="Descripción"
        placeholder="Descripción del evento"
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
        required
      />
      <TextInput
        label="Capacidad"
        placeholder="Número de personas"
        type="number"
        value={numberOfPeople}
        onChange={(event) => setNumberOfPeople(Number(event.currentTarget.value))}
        required
      />
      <Group mt="md">
        <Button onClick={onClose} variant="outline">
          Cancelar
        </Button>
        <Button onClick={handleSave}>Guardar</Button>
      </Group>
    </Modal>
  );
};

export default CreateEventModal;
