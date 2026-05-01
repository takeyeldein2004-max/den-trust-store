import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import BorderGlow from "../components/BorderGlow"
import Aurora from "../components/Aurora"

function Home() {
  return (
    <div className="bg-white">
      {/* HERO SECTION - UPDATED FOR DARK THEME */}
      <section className="relative bg-den-navy text-white py-24 overflow-hidden">
        
        {/* The Aurora Background Component */}
        <Aurora
          // Using your brand colors for the aurora effect
          colorStops={['#1E3A8A', '#BFDBFE', '#B91C1C']} 
          amplitude={0.4}
          blend={0.4}
        />
        
        {/* The Content - with z-10 to be on top */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Premium Dental Materials
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light text-gray-200">
            Trusted by Dental Professionals — ROOTED IN QUALITY
          </p>

          {/* Button Group */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            
            {/* Browse Products Button (White) */}
            <BorderGlow borderRadius={12} glowColor="210 90 80" backgroundColor="#FFFFFF">
              <Link to="/products" className="w-full h-full flex items-center justify-center text-den-navy px-10 py-4 font-semibold text-lg">
                Browse Products
              </Link>
            </BorderGlow>

            {/* Contact Us Button (Transparent/Bordered) */}
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-den-navy transition px-6 py-2 rounded-lg font-semibold inline-block"
            >
              Contact Us
            </Link>

            {/* Offers Button (Red) */}
            <BorderGlow borderRadius={12} glowColor="0 100 80" backgroundColor="#B91C1C">
              <Link to="/offers" className="w-full h-full flex items-center justify-center text-white px-10 py-4 font-semibold text-lg">
                🔥 View Offers
              </Link>
            </BorderGlow>

          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <motion.section 
        className="py-20 bg-gray-50"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-den-navy mb-12">
            Why Choose DEN TRUST?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h3 className="text-xl font-semibold text-den-navy mb-3">High Quality Materials</h3>
              <p className="text-gray-600">We supply certified and premium dental materials for all specialties.</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h3 className="text-xl font-semibold text-den-navy mb-3">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping to clinics and hospitals.</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h3 className="text-xl font-semibold text-den-navy mb-3">Professional Support</h3>
              <p className="text-gray-600">Dedicated support team ready to assist dental professionals.</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home