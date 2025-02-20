"use client";

import { useState } from "react";
import { Button, Card, Center, Text, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";

const RecoveryPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleRecoveryPassword = async () => {
    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to recovery password");
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card shadow="sm" m="lg" radius="md" withBorder>
        <Text size="lg" w={500} mb="md">
          Recuperar Contraseña
        </Text>
        {error && <Text c="red">{error}</Text>}
        <TextInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} mb="md" required />
        <Button onClick={handleRecoveryPassword}>Recuperar</Button>
        <Center>
          <Text style={{ fontSize: 12 }}>
            ¿Ya tenes una cuenta?{" "}
            <Text component="span" style={{ cursor: "pointer", color: "#00bfff" }} onClick={() => router.push("/")}>
              Ingresar
            </Text>
          </Text>
        </Center>
      </Card>
    </div>
  );
};

export default RecoveryPassword;
