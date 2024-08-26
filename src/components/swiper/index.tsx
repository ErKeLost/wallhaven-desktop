// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';


// import required modules
import { EffectCards } from 'swiper/modules';

export default function App({ data, changePaper, onImageClick }) {
  return (
    <>
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
      >
        {data?.map((item) => {
          return (
            <SwiperSlide key={item.id}>
              <img className='w-full h-full object-cover' src={item.path} alt="wallpaper" onClick={() => onImageClick(item)} />
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  );
}
