import React from 'react'
import { services } from "@/data/services";


const Who = () => {
  const service = services["new-adult-passport"];

  return (
    <div>
          <div className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12 p-4 md:p-8">
          {/* Who Is It For */}
          <div className="text-center md:text-left">
            <h3 className="font-bold mb-2 md:mb-3 text-[#222222] text-base font-grotesk">
              {service.whoFor.title}
            </h3>
            <p className="text-[#666666] text-sm">
              {service.whoFor.description}
            </p>
          </div>

          {/* Processing Time */}
          <div className="text-center md:text-left">
            <h3 className="font-bold mb-2 md:mb-3 text-[#222222] text-base font-grotesk">
              {service.processingTime.title}
            </h3>
            <p className="text-[#666666] text-sm">
              {service.processingTime.description}
            </p>
          </div>

          {/* Cost */}
          <div className="text-center md:text-left">
            <h3 className="font-bold mb-2 md:mb-3 text-[#222222] text-base font-grotesk">
              {service.cost.title}
            </h3>
            <p className="text-[#666666] text-sm">{service.cost.description}</p>
          </div>
        </div>
      </div>
        </div>
  )
}

export default Who