"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import Card from "./card";
import { CloudinaryResource, TrackObjectFull } from "@/type/dataType";
import "swiper/css";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";

interface HorizontalProps {
  data: TrackObjectFull[] | CloudinaryResource[];
}

export default function Horizontal({ data }: HorizontalProps) {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, A11y]}
        spaceBetween={16}
        slidesPerView="auto"
        slidesPerGroup={2}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className="!p-8"
      >
        {data &&
          data.length > 0 &&
          data.map((item) => (
            <SwiperSlide key={item.id} className="!w-auto !select-none">
              <Card card={item} />
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Navigation Buttons */}
      <div className="swiper-button-prev absolute p-2 left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 backdrop-blur-md text-white rounded-full hover:bg-black/50 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center cursor-pointer shadow-lg">
        <ChevronLeft className="w-8 h-8 text-white/90" />
      </div>
      <div className="swiper-button-next absolute p-2 right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 backdrop-blur-md text-white rounded-full hover:bg-black/50 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center cursor-pointer shadow-lg">
        <ChevronRight className="w-8 h-8 text-white/90" />
      </div>
    </div>
  );
}
