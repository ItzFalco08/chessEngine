import Image from "next/image";
import Button from '@/components/Button'

export default function Home() {
  return (
   <div className="h-screen flex flex-col items-center justify-center">
    {/* <h1 className="mb-4 text-2xl font-semibold">Play Smooth Chess</h1> */}
    <Button/>
   </div>
  );
}
