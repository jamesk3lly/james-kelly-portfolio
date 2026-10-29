import Link from "next/link";
import { Container } from "@/components/Container";

// Temporary placeholder. The real home page is built in step 3.
export default function Home() {
  return (
    <Container className="py-24">
      <h1 className="max-w-5xl font-display text-display">
        Positioning statement goes here.
      </h1>
      <p className="mt-8 max-w-2xl text-lede text-muted">
        Home page comes in step 3. For now, review the{" "}
        <Link href="/type" className="prose-link text-text">
          type and colour specimen
        </Link>
        .
      </p>
    </Container>
  );
}
