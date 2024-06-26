import Image from "next/image";
import React from "react";
import { Variants, motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  return (
    <>
      <motion.div className="w-full px-4 flex flex-col items-center justify-start min-h-screen">
        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "keyframes", duration: 0.4, ease: "easeIn" }}
          className="sm:mt-5   relative text-2xl font-medium text-center md:font-semibold leading-tight tracking-tight md:tracking-tighter md:text-4xl lg:text-6xl"
        >
          <motion.span>
            Fresh & Modern <br className="hidden md:flex" /> approach to Social
            media 🗣📢
          </motion.span>
        </motion.h2>
        <motion.div
          initial={{ y: 50, scale: 0 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ type: "keyframes", duration: 0.4, ease: "easeIn" }}
        >
          <Image
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={"/window_shot.png"}
            width={1500}
            height={1000}
            quality={100}
            alt=""
            className=" w-full "
          />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "keyframes", duration: 0.75, delay: 1.5 }}
        className="bg-green-300 text-black font-medium flex items-center justify-center absolute top-0 w-full px-4 py-2"
      >
        <span
          onClick={() => router.push("/home")}
          className="w-full flex group items-center justify-center gap-2"
        >
          Start connecting{" "}
          <ArrowRight className="group-hover:-rotate-45 duration-100 ease-linear opacity-90 size-5" />
        </span>
        <span className="flex items-center justify-center gap-2">
          <Github className="opacity-80 size-5" />
        </span>
      </motion.div>
      {/*
      <motion.section
        variants={variants}
        initial="hide"
        animate="show"
        className="max-w-4xl min-h-screen flex flex-col items-center justify-start mt-8"
      >
        <motion.div className="mb-4" variants={variants}>
          <Image
            src={"/sun2.svg"}
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
            className="relative text-2xl font-medium text-center md:font-semibold leading-tight tracking-tight md:tracking-tighter md:text-4xl lg:text-6xl"
          >
            <motion.span>
              Fresh & Modern <br className="hidden md:flex" /> approach to
              Social media 🗣📢
            </motion.span>
          </motion.h2>
        </motion.div>
        <motion.div
          initial={{ scale: 0.7, translateY: 80 }}
          animate={{ scale: 1, translateY: 0 }}
          transition={{ duration: 0.7, type: "tween ", ease: "easeIn" }}
          className="flex m-2 hover: my-10 shadow-2xl shadow-black/80 select-none rounded-2xl overflow-hidden"
        >
          <Image

            src={"/shot2.png"}
            width={1500}
            height={1200}
            alt=""
            className=""
          />
        </motion.div>
      </motion.section> */}
    </>
  );
};

export default HeroSection;
