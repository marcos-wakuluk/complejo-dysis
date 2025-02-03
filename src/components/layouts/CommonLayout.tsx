import { ReactNode } from "react";
import { AppShell, Title } from "@mantine/core";

interface CommonLayoutProps {
  children: ReactNode;
}

export function CommonLayout({ children }: CommonLayoutProps) {
  return (
    <AppShell>
      <AppShell.Header>
        <Title order={2} style={titleStyle} mt="lg">
          Complejo Dysis - Administrador
        </Title>
      </AppShell.Header>
      <AppShell.Main style={{ paddingTop: "100px" }}>{children}</AppShell.Main>
    </AppShell>
  );
}

const titleStyle = {
  fontSize: "2rem",
  color: "#00bfff",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  marginBottom: "1.5rem",
  fontFamily: "Arial Black",
  justifySelf: "center",
};
