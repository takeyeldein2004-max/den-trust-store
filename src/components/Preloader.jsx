import { motion } from "framer-motion"

// Animation variants for the logo text
const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.6, 0.01, -0.05, 0.95],
    },
  },
}

// Animation variants for the background panels
const panelVariants = {
  initial: { y: 0 },
  animate: {
    y: "-100%",
    transition: {
      duration: 1.2,
      ease: [0.87, 0, 0.13, 1],
      delay: 1.5, // Wait 1.5s before sliding away
    },
  },
}

function Preloader() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      
      {/* Main content with logo */}
      <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
        <motion.h1
          className="text-4xl md:text-6xl font-bold overflow-hidden"
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          <span className="text-den-navy">DEN</span>{" "}
          <span className="text-den-red">TRUST</span>
        </motion.h1>
      </div>
      
      {/* Animated background panels */}
      <motion.div
        className="absolute inset-0 bg-den-navy z-20"
        variants={panelVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div
        className="absolute inset-0 bg-den-red z-20"
        style={{ y: "100%" }} // Starts from the bottom
        variants={panelVariants}
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "100%" }}
        transition={{ duration: 1.2, ease: [0.87, 0, 0.13, 1], delay: 1.5 }}
      />

    </div>
  )
}

export default Preloader