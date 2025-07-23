import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseInstructions(htmlInstructions: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlInstructions, "text/html");
  const listItems = doc.querySelectorAll("li");
  return Array.from(listItems).map((li) => li.textContent?.trim() || "");
}
