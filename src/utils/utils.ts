export function formatDate(dateString: string): string {
  const [day, month, year] = dateString.split("-");

  const fullYear = `20${year}`;
  const date = new Date(Number(fullYear), Number(month) - 1, Number(day));

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return date.toLocaleDateString("es-ES", options);
}
