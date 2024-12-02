export default function createIso(year: number, month: number, day: number) {
  const newDate = new Date(year, month - 1, day); // month - 1 because JS months are 0-indexed

  // Manually set the time to 00:00:00 in the local time zone
  newDate.setHours(0, 0, 0, 0);

  // Create a manual ISO string without converting to UTC
  const isoDate = `${newDate.getFullYear()}-${String(
    newDate.getMonth() + 1
  ).padStart(2, "0")}-${String(newDate.getDate()).padStart(
    2,
    "0"
  )}T00:00:00.000Z`;

  return isoDate;
}
