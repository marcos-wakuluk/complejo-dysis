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
      const response = await fetch("/api/users/recovery-password", {
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
        <TextInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} mb="md" />
        <Button onClick={handleRecoveryPassword}>Recuperar</Button>
        <Center mt="md">
          <Text style={{ fontSize: "small" }}>
            ¿Ya tenes cuenta?{" "}
            <Text
              component="span"
              style={{ fontSize: "small", fontWeight: "bold", cursor: "pointer" }}
              onClick={() => router.push("/")}
            >
              Iniciar sesion
            </Text>
          </Text>
        </Center>
      </Card>
    </div>
  );
};

export default RecoveryPassword;
