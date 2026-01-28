"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface AnimatedPassportProps {
  primaryColor?: string;
  size?: "small" | "medium" | "large" | "xlarge";
  imageSrc?: string;
  imageAlt?: string;
}

const AnimatedPassport: React.FC<AnimatedPassportProps> = ({
  primaryColor = "#004D90",
  size = "xlarge",
  imageSrc = "/assets/passportLogo.webp",
  imageAlt = "US Passport",
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sizeMap = {
    small: { width: isMobile ? 80 : 120, height: isMobile ? 80 : 120 },
    medium: { width: isMobile ? 120 : 200, height: isMobile ? 120 : 200 },
    large: { width: isMobile ? 160 : 240, height: isMobile ? 160 : 240 },
    xlarge: { width: isMobile ? 200 : 300, height: isMobile ? 200 : 300 },
  };

  if (isMobile) {
    return (
      <motion.div
        className="relative !z-0"
        style={{
          width: sizeMap[size].width,
          height: sizeMap[size].height,
        }}
        initial="initial"
        animate="animate"
        whileTap="tap"
        variants={{
          initial: {
            opacity: 0,
          },
          animate: {
            opacity: 1,
          },
          tap: {
            opacity: 1,
          },
        }}
        transition={{
          duration: 0.6,
        }}
      >
        <motion.div
          variants={{
            initial: {
              rotate: "0deg",
              scale: 0.8,
            },
            animate: {
              rotate: "0deg",
              scale: 1,
            },
            tap: {
              rotate: "42deg",
              scale: 1,
            },
          }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="absolute inset-0"
        >
          {/* Background Elements Container */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center mb-10"
            variants={{
              initial: {
                scale: 1,
                y: 0,
                opacity: 0,
              },
              animate: {
                scale: 1.5,
                y: 50,
                x: 0,
                opacity: 0.1,
              },
              tap: {
                scale: 1.5,
                y: 50,
                x:-10,
                opacity: 0.1,
              },
            }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {/* Wing SVG */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 376 257"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M188.206 157.912C133.4 157.912 88.9625 113.031 88.9625 57.6687C88.9253 37.4465 95.2895 17.6835 106.663 0.962433C94.4579 14.7468 85.9489 31.4015 81.9312 49.3687L0.5 71.4999L76.2062 92.1249C76.2375 84.0737 77.2384 76.0555 79.1875 68.2437C79.1125 69.9124 79.075 71.5812 79.075 73.2437C79.0741 98.6185 87.932 123.202 104.082 142.774C120.233 162.346 142.693 175.684 167.606 180.5L188.206 257.5L208.131 184.375C206.125 184.494 204.1 184.562 202.062 184.562C197.121 184.558 192.187 184.188 187.3 183.456H188.231C213.761 183.449 238.482 174.5 258.102 158.165C277.721 141.829 290.255 119.501 294.825 95.0312L375.5 73.2874L299.794 52.6624C299.766 59.7372 298.914 66.7891 297.4 73.6999C297.069 47.6036 287.364 22.4967 270.056 2.96243C281.429 19.6835 287.493 39.4465 287.456 59.6687C287.456 115.031 242.019 159.912 187.212 159.912C182.321 159.908 177.437 159.54 172.569 158.814L188.206 159.912Z"
                fill={primaryColor}
              />
            </svg>
          </motion.div>
          {/* Red Arrow */}
          <motion.div
            className="absolute -z-10 bottom-0 top-16 h-fit w-[200px] inset-0 flex items-center justify-center"
            variants={{
              initial: {
                y: 0,
                opacity: 0,
                scale: 1,
              },
              animate: {
                y: -120,
                opacity: 0,
                scale: 1.4,
              },
              tap: {
                y: -120,
                opacity: 0.4,
                scale: 1.4,
                x: -10,
              },
            }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <svg
              width="40%"
              height="40%"
              viewBox="0 0 150 134"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M75.0625 0.424927L0.818726 133.15C19.5573 119.601 41.6565 111.457 64.7062 109.606L75.0625 43.2687L85.4187 109.606C108.47 111.457 130.572 119.601 149.312 133.15L75.0625 0.424927Z"
                fill="#EE473D"
              />
            </svg>
          </motion.div>
        </motion.div>
        {/* Passport Image */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            tap: { opacity: 1 },
          }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={700}
            height={1000}
            className="object-contain"
            style={{
              transform: "scale(0.9) translateY(-20px)",
              willChange: "transform",
            }}
            priority
            quality={80}
          />
        </motion.div>
      </motion.div>
    );
  }

  // Desktop version
  return (
    <motion.div
      className="relative"
      style={{
        width: sizeMap[size].width,
        height: sizeMap[size].height,
      }}
      initial="initial"
      whileHover="hover"
    >
      <motion.div
        variants={{
          initial: {
            rotate: "0deg",
            scale: 1,
          },
          hover: {
            rotate: "42deg",
            scale: 1.1,
            transition: {
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            },
          },
        }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="absolute inset-0"
      >
        {/* Background Elements Container */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center mb-10"
          variants={{
            initial: {
              scale: 1.7,
              y: 88,
              opacity: 0.1,
            },
          }}
        >
          {/* Wing SVG */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 376 257"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M188.206 157.912C133.4 157.912 88.9625 113.031 88.9625 57.6687C88.9253 37.4465 95.2895 17.6835 106.663 0.962433C94.4579 14.7468 85.9489 31.4015 81.9312 49.3687L0.5 71.4999L76.2062 92.1249C76.2375 84.0737 77.2384 76.0555 79.1875 68.2437C79.1125 69.9124 79.075 71.5812 79.075 73.2437C79.0741 98.6185 87.932 123.202 104.082 142.774C120.233 162.346 142.693 175.684 167.606 180.5L188.206 257.5L208.131 184.375C206.125 184.494 204.1 184.562 202.062 184.562C197.121 184.558 192.187 184.188 187.3 183.456H188.231C213.761 183.449 238.482 174.5 258.102 158.165C277.721 141.829 290.255 119.501 294.825 95.0312L375.5 73.2874L299.794 52.6624C299.766 59.7372 298.914 66.7891 297.4 73.6999C297.069 47.6036 287.364 22.4967 270.056 2.96243C281.429 19.6835 287.493 39.4465 287.456 59.6687C287.456 115.031 242.019 159.912 187.212 159.912C182.321 159.908 177.437 159.54 172.569 158.814L188.206 159.912Z"
              fill={primaryColor}
            />
          </svg>
        </motion.div>
        {/* Red Arrow */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={{
            initial: {
              y: -170,
              opacity: 0,
            },
            hover: {
              opacity: 0.4,
              scale: 1.2,
            },
          }}
        >
          <svg
            width="60%"
            height="60%"
            viewBox="0 0 150 134"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M75.0625 0.424927L0.818726 133.15C19.5573 119.601 41.6565 111.457 64.7062 109.606L75.0625 43.2687L85.4187 109.606C108.47 111.457 130.572 119.601 149.312 133.15L75.0625 0.424927Z"
              fill="#EE473D"
            />
          </svg>
        </motion.div>
      </motion.div>
      {/* Passport Image */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        variants={{
          initial: {},
          hover: {
            transition: {
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            },
          },
        }}
        transition={{
          duration: 1.2,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={1000}
          height={1000}
          className="object-contain"
          priority
          quality={100}
        />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedPassport;
