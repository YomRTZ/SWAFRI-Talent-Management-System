import Cards from '../../components/common/Card'
import type { AuthModalOption } from '../../features/auth/types/auth.types'

interface HomeProps {
  setOpenModal: (modal: AuthModalOption | null) => void;
}

function Home({ setOpenModal }: HomeProps) {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/hero11.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
{/* <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-black/20 to-black/40 z-[1]" /> */}
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen 
        px-6 sm:px-10 md:px-12 lg:px-16 
        pt-24 sm:pt-28 md:pt-32
        pb-10">

        {/* Top Content */}
  <div className="flex-1 flex flex-col justify-center">

  {/* Title */}
  <h1 className="
    font-[Sora] 
    text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
    font-semibold sm:font-bold
    leading-[1.2] sm:leading-tight 
    tracking-tight
    max-w-3xl
  ">
    <span className="text-[#4ade7f]">SWAFRI</span>{" "}
    <span className="text-white">Talent Management Platform</span>
  </h1>

  {/* Subtitle */}
  <p className="
    mt-3 sm:mt-4
    text-gray-300 
    text-sm sm:text-base md:text-lg 
    leading-relaxed sm:leading-7
    font-normal sm:font-medium
    max-w-2xl
  ">
    Hire top African IT talent starting in Ethiopia and manage your workforce with precision.
    An all in one platform delivering Swiss-quality standards with seamless, hassle free operations.
  </p>

  {/* Buttons */}
  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">

    <button
      onClick={() => setOpenModal('login')}
      className="
        px-5 sm:px-8 py-3 
        text-sm sm:text-base
        bg-green-400 hover:bg-green-500 
        rounded-xl font-medium sm:font-semibold
        transition
      "
    >
      Get Started
    </button>

    <a
      href="https://swafri.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="
        bg-gradient-to-r from-black/60 to-black/30 
        backdrop-blur-lg border border-white/10 
        text-white 
        px-5 sm:px-8 py-3 
        rounded-xl shadow-xl 
        text-sm sm:text-base
        inline-block
      "
    >
      SWAFRI Talents
    </a>

  </div>
</div>

        {/* Bottom Cards (Responsive & Safe) */}
        <div className="mt-10 w-full">
          <Cards />
        </div>

      </div>
    </section>
  )
}

export default Home