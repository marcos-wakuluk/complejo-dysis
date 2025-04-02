"use client";
import { ReactNode, useEffect, useState, use } from "react";

export default function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [event, setEvent] = useState<{
    startTime: ReactNode;
    date: ReactNode;
    name: string;
    description: string;
    tandas: { _id: string; date: string; price: string }[];
  } | null>(null);

  const [currentTanda, setCurrentTanda] = useState<{
    _id: string;
    date: string;
    price: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events?id=${id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch event");
        }

        const data = await response.json();
        setEvent(data[0]);

        const today = new Date();
        const tandaActual = data[0].tandas.find((tanda: { date: string }) => {
          const tandaDate = new Date(tanda.date.split("-").reverse().join("-"));
          return tandaDate >= today;
        });

        setCurrentTanda(tandaActual || null);
      } catch (error) {
        console.log(error);
        setError((error as Error)?.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {event && (
        <>
          <h1>{event.name}</h1>
          <p>{event.description}</p>
          <p>{event.date}</p>
          <p>{event.startTime}</p>
          <p>{currentTanda?.price}</p>
        </>
      )}
    </div>
  );
}
