import { monogram } from "@/lib/monogram";

// Icon used when someone adds the site to their phone's home screen.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return monogram(size.width);
}
