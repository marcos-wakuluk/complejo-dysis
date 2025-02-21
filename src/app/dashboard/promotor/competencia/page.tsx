import { Card, Container, SimpleGrid, Text, Title } from "@mantine/core";

export default function Competencia() {
  return (
    <Container size="xl" style={{ padding: "20px" }}>
      <Title order={2} mb="lg">
        Competencia
      </Title>
      <SimpleGrid cols={2} spacing="lg">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="lg" w={500}>
            Ver Competencias
          </Text>
        </Card>
      </SimpleGrid>
    </Container>
  );
}
