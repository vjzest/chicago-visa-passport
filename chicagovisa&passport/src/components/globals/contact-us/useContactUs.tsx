import {ContactUsSchema} from "@/lib/form-schema";
import {z} from "zod";

const useContactUs = () => {
  const contact = async (formData: z.infer<typeof ContactUsSchema>) => {
    try {
    } catch (error) {
      console.log("Contact Error: ", error);
    }
  };

  return {contact};
};

export default useContactUs;
