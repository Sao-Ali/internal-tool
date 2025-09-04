import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Welcome to Ali's Internal Tool</h1>
      <Link href="/panda"> Go to Panda tool </Link>
    </main> 
  );
}
