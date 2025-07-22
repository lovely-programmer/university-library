import { cn } from "@/lib/utils";
import Image from "next/image";
import BookCoverSvg from "./BookCoverSvg";

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall: "book-cover-extra-small",
  small: "book-cover-small",
  medium: "book-cover-medium",
  regular: "book-cover-regular",
  wide: "book-cover-wide",
};

interface Props {
  className?: string;
  variant?: BookCoverVariant;
  coverColor: string;
  coverImage: string;
}
export default function BookCover({
  className,
  variant = "regular",
  coverColor,
  coverImage,
}: Props) {
  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className
      )}
    >
      <BookCoverSvg coverColor={coverColor} />

      <div className="relative z-10 left-[12%] w-[87.5%] h-[230px] ">
        <img
          src={coverImage}
          alt="cover"
          className="rounded-sm object-fill size-[200px]"
        />
      </div>
    </div>
  );
}
