import { useState } from "react";
import { Modal, TextInput, Textarea, Button, Group } from "@mantine/core";
import { Event } from "@/types/Events";

interface InputChangeEvent {
  target: {
    name: string;
    value: string;
  };
}

interface EditEventModalProps {
  readonly event: Event;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (updatedEvent: Event) => void;
}

export function EditEventModal({ event, isOpen, onClose, onSave }: EditEventModalProps) {
  const [updatedEvent, setUpdatedEvent] = useState(event);

  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setUpdatedEvent({ ...updatedEvent, [name]: value });
  };

  const handleSave = () => {
    onSave(updatedEvent);
    onClose();
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Editar Evento">
      {updatedEvent && (
        <form>
          <TextInput label="Nombre" name="name" value={updatedEvent.name} onChange={handleInputChange} />
          <Textarea
            label="Descripcion"
            name="description"
            value={updatedEvent.description}
            onChange={handleInputChange}
          />
          <TextInput
            label="Fecha"
            name="date"
            value={new Date(event.date).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}
            onChange={handleInputChange}
          />
          <TextInput label="Inicio" name="startTime" value={updatedEvent.startTime} onChange={handleInputChange} />
          <TextInput
            label="Capacidad"
            name="numberOfPeople"
            value={updatedEvent.numberOfPeople}
            onChange={handleInputChange}
          />
          <TextInput
            label="Ingresados"
            name="peopleEntered"
            value={updatedEvent.peopleEntered}
            onChange={handleInputChange}
          />
          <TextInput
            label="Tickets Vendidos"
            name="ticketsSold"
            value={updatedEvent.ticketsSold}
            onChange={handleInputChange}
          />
          <TextInput label="Estado" name="status" value={updatedEvent.status} onChange={handleInputChange} />
          <Group mt="md" justify="center">
            <Button variant="outline" color="red" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </Group>
        </form>
      )}
    </Modal>
  );
}
