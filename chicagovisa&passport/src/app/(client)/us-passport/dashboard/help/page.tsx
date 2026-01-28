import Link from "next/link";
import { CircleHelp, Headset } from "lucide-react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BreadCrumbComponent } from "@/components/globals";

const HelpCenter = () => {
  const categories = [
    {
      icon: <CircleHelp size={24} className="mx-auto text-white" />,
      title: "FAQ",
      link: "/dashboard/help/faq",
      description:
        "Get answers to common questions about Passport applications, requirements, and processes.",
    },
    {
      icon: <Headset size={24} className="mx-auto text-white" />,
      title: "Support",
      link: "/dashboard/help/support",
      description:
        "Reach out to our support team for help with your Passport application or any related issues.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6 rounded-lg bg-primary p-8 text-white">
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="mt-2">
          {`Find the information and support you need for your Passport application
          process. Whether you have questions or need assistance, we're here to
          help.`}
        </p>
        {/* <div className="mt-4">
          <div className="relative w-full text-black md:w-1/3">
            <Input type="text" placeholder="Search" className="pl-10" />
            <Search className="absolute left-3 top-2.5 text-gray-500" />
          </div>
        </div> */}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <Link href={category?.link} key={index}>
            <Card
              key={index}
              className="flex flex-col items-center bg-white pt-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="flex flex-col items-start">
                <div className="mx-6 flex size-10 items-center justify-center rounded-full bg-primary">
                  {category?.icon}
                </div>
                <CardContent className="mt-4 space-y-3 ">
                  <CardTitle className="font-semibold">
                    {category?.title}
                  </CardTitle>
                  <CardDescription>{category?.description}</CardDescription>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HelpCenter;
