import { Box, chakra, Link } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { heroBrand } from "../types";
import { Autoplay } from "swiper/modules";
import Image from "next/image";

const ChakraSwiper = chakra(Swiper);

interface BrandsSwiperProps {
  brands: heroBrand[];
  reverse?: boolean;
}
export const BrandsSwiper = ({ brands, reverse }: BrandsSwiperProps) => {
  return (
    <ChakraSwiper
      allowTouchMove={false}
      width="full"
      autoplay={{
        delay: 100,
        reverseDirection: reverse,
      }}
      speed={5000}
      loop
      slidesPerView="auto"
      spaceBetween="10px"
      modules={[Autoplay]}
      marginBottom="5px"
      sx={{
        ".brand_card": {
          height: {
            base: "39px",
            md: "40px",
            xl: `min(${14.4 * 3}px,3vw)`,
          },
          maxWidth: {
            base: "109px !important",
            md: "fit-content",
            xl: `min(${14.4 * 5}px,5vw)`,
          },
          minWidth: { md: "218px" },
          display: "flex",
          justifyContent: "center",
          columnGap: "8px",
        },
        "&>div": {
          marginBottom: "5px",
        },
        ".swiper-wrapper": {
          "transition-timing-function": "linear",
        },
      }}
    >
      {brands.map((brand) => (
        <SwiperSlide
          className="brand_card"
          style={{
            backgroundColor: "#FFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid #000000",
            boxShadow: "8px 9px 0px 0px #000000",
          }}
          key={brand.id}
        >
          <Box
            position="relative"
            boxSize={{ base: "20px", xl: `min(${14.4 * 1.2}px,1.2vw)` }}
          >
            <Image fill priority src={brand.src} alt={brand.name} />
          </Box>
          <Link
            fontFamily="plusJakartaSans"
            fontWeight="700"
            height="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            isExternal
            fontSize={{ base: "12px", xl: `min(${14.4 * 1.2}px,1.2vw)` }}
            href={brand.href}
          >
            {brand.name}
          </Link>
        </SwiperSlide>
      ))}
    </ChakraSwiper>
  );
};
