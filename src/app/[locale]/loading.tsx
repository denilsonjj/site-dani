import Image from "next/image";

export default function LocaleLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0d3024] px-6 text-white">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-36 w-60 animate-pulse sm:h-44 sm:w-72">
          <Image
            alt="Dani Therapies"
            className="object-contain"
            fill
            priority
            sizes="(min-width: 640px) 18rem, 15rem"
            src="/dani-therapies-logo-cropped.webp"
          />
        </div>
        <span className="mt-5 h-px w-24 bg-[#C9A227]/70" />
      </div>
    </main>
  );
}
