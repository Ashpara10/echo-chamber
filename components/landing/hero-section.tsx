import Image from "next/image";
import React from "react";
import { Variants, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const variants: Variants = {
  show: {
    opacity: 1,
    translateY: 0,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.1,
      type: "tween",
      ease: "easeInOut",
      duration: 0.6,
    },
  },
  hide: {
    opacity: 0,
    translateY: 50,
  },
};

const HeroSection = () => {
  return (
    <motion.section
      variants={variants}
      initial="hide"
      animate="show"
      className="max-w-4xl min-h-screen flex flex-col items-center justify-start"
    >
      <motion.div className="mb-4" variants={variants}>
        <Image
          src={"/logo.png"}
          width={80}
          height={80}
          alt=""
          className="aspect-square size-14 lg:size-24"
        />
      </motion.div>
      <motion.div
        variants={variants}
        className=" w-full flex mb-3 flex-col items-center justify-center"
      >
        <motion.h2
          variants={{}}
          className="relative text-3xl text-center font-medium md:font-semibold leading-tight tracking-tighter md:text-4xl lg:text-6xl"
        >
          <motion.span>
            Fresh & Modern approach <br />
          </motion.span>
          <motion.span> to Social media 🗣📢</motion.span>
        </motion.h2>
        {/* <div className="mt-5">
          <button className="text-xl flex items-center justify-center gap-x-1 font-medium bg-green-400 rounded-3xl px-5 py-2.5 text-black">
            Signup
            <ChevronRight />
          </button>
        </div> */}
      </motion.div>
      <motion.div
        initial={{ scale: 0.7, translateY: 80 }}
        animate={{ scale: 1, translateY: 0 }}
        transition={{ duration: 0.7, type: "tween ", ease: "easeIn" }}
        className="flex m-2 hover: my-10 ring-[10px] ring-black rounded-2xl overflow-hidden"
      >
        <Image
          src={"/echo1.png"}
          width={1500}
          height={1200}
          alt=""
          className=""
        />
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
