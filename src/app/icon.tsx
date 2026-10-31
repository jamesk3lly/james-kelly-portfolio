import { monogram } from "@/lib/monogram";

// Browser tab icon (favicon).
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return monogram(size.width);
}
