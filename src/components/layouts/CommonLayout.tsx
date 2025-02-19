import { ReactNode } from "react";
import { AppShell, Group, Title, Menu, Burger } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/navigation";
interface CommonLayoutProps {
  readonly children: ReactNode;
}

export function CommonLayout({ children }: CommonLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 425px)");
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <AppShell padding="md">
      <AppShell.Header>
        <Group justify="space-between" style={{ width: "100%" }} display="flex">
          <Title order={isMobile ? 4 : 2} style={titleStyle} mt="sm">
            Complejo Dysis
          </Title>
          <Menu>
            <Menu.Target>
              <Burger></Burger>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => console.log("Usuarios")}>Usuarios</Menu.Item>
              <Menu.Item onClick={() => console.log("Eventos")}>Eventos</Menu.Item>
              <Menu.Item onClick={() => console.log("Invitados")}>Invitados</Menu.Item>
              <Menu.Item onClick={() => console.log("Inventario")}>Inventario</Menu.Item>
              <Menu.Item onClick={() => console.log("Ventas")}>Ventas</Menu.Item>
              <Menu.Item onClick={handleLogout}>Cerrar sesión</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>
      <AppShell.Main style={mainStyle}>{children}</AppShell.Main>
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
  marginLeft: "2%",
};

const mainStyle = {
  display: "block",
  justifyContent: "center",
  alignItems: "center",
  height: "calc(100vh - 30px)", // Adjust height based on header height
  paddingTop: "60px", // Adjust padding based on header height
  marginTop: "60px", // Adjust padding based on header height
};
