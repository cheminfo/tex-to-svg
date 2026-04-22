export interface DocEntry {
  tex: string;
  label: string;
}

export interface DocSection {
  title: string;
  accent: string;
  entries: DocEntry[];
}

export interface GreekLetter {
  command: string;
  name: string;
}
