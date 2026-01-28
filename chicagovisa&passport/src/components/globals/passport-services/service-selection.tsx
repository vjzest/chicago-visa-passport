import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ENV } from "@/lib/env";

interface PassportService {
  title: string;
  description: string;
  requirementsLink: string;
}

const passportServices: PassportService[] = [
  {
    title: "New Passport",
    description:
      "For first-time applicants that are aged 16 and older and adults whose previous passports expired over five years ago.",
    requirementsLink: `${ENV.APPLY_URL}/apply?service-type=new-adult-passport`,
  },
  {
    title: "Passport Renewal",
    description:
      "Passport renewal is available for adults aged 16 and older whose previous passports have expired.",
    requirementsLink: `${ENV.APPLY_URL}/apply?service-type=passport-renewal`,
  },
  {
    title: "Child Passport",
    description:
      "Whether or not the child has previously held a passport, applicants under 16 must apply for a child passport.",
    requirementsLink: `${ENV.APPLY_URL}/apply?service-type=child-passport`,
  },
  {
    title: "Name Change",
    description:
      "Fast and reliable passport processing for name changes on existing passports.",
    requirementsLink: `${ENV.APPLY_URL}/apply?service-type=passport-name-change`,
  },
  {
    title: "Lost Passport",
    description:
      "If you're 16 or older and your passport has been lost or stolen, you should use our Lost Passport service to apply for a replacement.",
    requirementsLink: `${ENV.APPLY_URL}/apply?service-type=lost/stolen-passport`,
  },
  {
    title: "Damaged Passport",
    description:
      "If your passport is damaged, it’s essential to replace it as soon as possible to avoid travel delays.",
    requirementsLink: `${ENV.APPLY_URL}/apply?service-type=damaged-passport`,
  },
  {
    title: "Passport Card",
    description:
      "Obtaining a passport card is an essential step for convenient border crossing and travel within the U.S. and nearby countries.",
    requirementsLink: `${ENV.APPLY_URL}/apply?service-type=passport-card",`,
  },
];

export const ServiceSelection = () => {
  return (
    <section className="w-full px-6 py-10 ">
      <div className="mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-3 lg:py-4">
        <div className="text-center mb-10">
          <h2 className="font-grotesk text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#144066] mb-4">
            Select Passport Service
          </h2>
          <p className="text-gray-600 font-inter max-w-2xl mx-auto">
            At Chicago Passport & Visa Expedite, we prioritize your time with our fast processing
            services.
          </p>
        </div>

        <div className="font-inter bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {passportServices.map((service, index) => (
            <Card
              key={index}
              className="group flex flex-col border-opacity-20 border-gray-300"
            >
              {" "}
              {/* Added flex flex-col */}
              <CardHeader>
                <CardTitle className="text-xl font-inter font-bold text-[#144066] ">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                {" "}
                {/* Added flex flex-col flex-1 */}
                <CardDescription className="text-gray-600 text-[16px] mb-4 line-clamp-4">
                  {service.description}
                </CardDescription>
                <div className="mt-auto pt-4">
                  {" "}
                  {/* Added container with mt-auto */}
                  <Button
                    variant="ghost"
                    asChild
                    className="text-[#006DCC] hover:text-white bg-blue-50 hover:bg-[#006DCC] text-sm  font-medium
            transition-colors gap-2 rounded-full px-4 py-2 h-8"
                  >
                    <a href={service.requirementsLink}>
                      Start Your Application
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
