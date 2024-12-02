export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";

  // Create a date object and force UTC to avoid timezone issues
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC", // Force UTC timezone
  }).format(date);
};
