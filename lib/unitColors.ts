// lib/unitColors.ts
// ─────────────────────────────────────────────────────────────────
// Unit colors keyed by unit UUID — never by name.
// When the godfather fetches units from the DB, pass them through
// getUnitColor(unit.id) to get the accent color.
// ─────────────────────────────────────────────────────────────────

export const UNIT_ID_COLORS: Record<string, { primary: string; text: string }> =
  {
    "5cda9c6d-3f43-4f39-b771-8e2be8d098fa": {
      primary: "#A6FF00",
      text: "#A6FF00",
    }, // Myrmidons
    "b7dddd87-4a44-45fd-8bc2-2d3dc00fa95c": {
      primary: "#FF6A00",
      text: "#FF6A00",
    }, // Spartans
    "c53fe16c-fb92-48c4-9ede-9135f6cb2d00": {
      primary: "#8A3FFC",
      text: "#8A3FFC",
    }, // Legio X
    "dce3f79c-602b-409f-99c2-a8f9601c0de9": {
      primary: "#6FF3FF",
      text: "#6FF3FF",
    }, // Einherjar
    "fb549072-d2eb-4107-9922-07d6bbf70699": {
      primary: "#FFC83D",
      text: "#FFC83D",
    }, // Narayani Sena
  };

export const DEFAULT_UNIT_COLOR = { primary: "#C8A84B", text: "#C8A84B" };

export function getUnitColor(unitId: string | null | undefined) {
  if (!unitId) return DEFAULT_UNIT_COLOR;
  return UNIT_ID_COLORS[unitId] ?? DEFAULT_UNIT_COLOR;
}
