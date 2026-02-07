// types/database.types.ts

export interface Unit {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  username: string;
  unit_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileWithUnit extends Profile {
  unit_name: string | null;
  unit_description: string | null;
}

// The 5 available units
export const AVAILABLE_UNITS = [
  {
    name: "Einherjar",
    description: "The chosen warriors of Norse legend, destined for greatness",
  },
  {
    name: "Legio X Equestris",
    description: "Caesar's most trusted legion, mounted warriors of Rome",
  },
  {
    name: "Myrmidons",
    description: "Elite warriors of Achilles, fiercely loyal and skilled",
  },
  {
    name: "Narayani Sena",
    description: "Divine army blessed with celestial power",
  },
  {
    name: "Spartans",
    description: "Warriors bred for combat, defenders of freedom",
  },
] as const;
