import { Card } from "@/components/ui/card";
import React from "react";

interface Step {
  title: string;
  description: string;
  isCompleted: boolean;
}

interface ProgressGuideProps {
  steps: Step[];
}

const ProgressGuide: React.FC<ProgressGuideProps> = ({ steps }) => {
  return (
    <Card className="flex items-start p-4 mb-4">
      {steps.map((step, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div className="relative flex items-center justify-center w-full">
            {index > 0 && (
              <div className="absolute z-5 top-1/2 right-1/2 w-full h-1 bg-gray-300">
                <div
                  className={`h-full bg-green-500 transition-all duration-300 ease-in-out ${
                    steps[index - 1].isCompleted ? "w-full" : "w-0"
                  }`}
                ></div>
              </div>
            )}
            <div
              className={`z-10 flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold ${
                step.isCompleted
                  ? "bg-green-500"
                  : index === 0
                    ? "bg-orange-400"
                    : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className="absolute top-1/2 left-1/2 w-full h-1 bg-gray-300">
                <div
                  className={`h-full bg-green-500 transition-all duration-300 ease-in-out ${
                    step.isCompleted ? "w-full" : "w-0"
                  }`}
                ></div>
              </div>
            )}
          </div>
          <div className="mt-3 text-center">
            <h3 className="text-sm md:text-base font-semibold">{step.title}</h3>
            <p className="text-sm hidden md:block text-gray-500 md:w-2/3 break-words mx-auto">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default ProgressGuide;
