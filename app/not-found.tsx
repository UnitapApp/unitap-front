import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mt-40 text-center">
      <Image
        className="mx-auto"
        src="/assets/images/404.svg"
        alt="not found"
        width={500}
        height={255}
      />
      <p className="font-semibold">Lost in space !</p>
      <p className="text-sm text-gray100">
        The page you are looking for cannot be found.
      </p>
      <div className="mt-5">
        <Link href="/">
          <button className="btn btn--sm btn--primary-light font-semibold tracking-wide">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
