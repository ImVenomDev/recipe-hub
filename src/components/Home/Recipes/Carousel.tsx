import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import clsx from "clsx"

type SlideCarouselProps = {
  children: ReactNode
}

export default function SlideCarousel({ children }: SlideCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 1.2,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 464px)": {
        slides: { perView: 3, spacing: 20 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 5, spacing: 24 },
      },
    },
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
    rubberband: true,
  })

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024)
    checkSize()
    window.addEventListener("resize", checkSize)
    return () => window.removeEventListener("resize", checkSize)
  }, [])

  const getPerView = () => {
    const slides = instanceRef.current?.options.slides
    if (slides && typeof slides === "object" && "perView" in slides) {
      return typeof slides.perView === "number" ? slides.perView : 1
    }
    return 1
  }

  const perView = getPerView()

  return (
    <div className="relative">
      {/* Carousel */}
      <div ref={sliderRef} className="keen-slider">
        {Array.isArray(children)
          ? children.map((child, index) => (
              <div className="keen-slider__slide" key={index}>
                {child}
              </div>
            ))
          : <div className="keen-slider__slide">{children}</div>}
      </div>

      {/* Arrows (desktop only) */}
      {loaded && instanceRef.current && isDesktop && (
        <>
          <button
            className={clsx(
              "absolute left-2 top-1/2 z-10 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition",
              { "opacity-50 cursor-not-allowed": currentSlide === 0 }
            )}
            onClick={() => instanceRef.current?.prev()}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>

          <button
            className={clsx(
              "absolute right-2 top-1/2 z-10 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition",
              {
                "opacity-50 cursor-not-allowed":
                  currentSlide >= instanceRef.current.track.details.slides.length - perView,
              }
            )}
            onClick={() => instanceRef.current?.next()}
            disabled={
              currentSlide >= instanceRef.current.track.details.slides.length - perView
            }
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </>
      )}
    </div>
  )
}
