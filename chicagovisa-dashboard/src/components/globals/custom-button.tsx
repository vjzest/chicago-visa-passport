import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface CustomBtnProps {
  /**
   * The type of button, can be "submit", "reset", "button", or undefined.
   */
  type: "submit" | "reset" | "button" | undefined;
  /**
   * The text displayed on the button.
   */
  text: string;
  /**
   * Additional CSS classes for custom styling.
   */
  className?: string;
  /**
   * The variant of the button, default is "primary".
   */
  variant?: VariantProps<typeof buttonVariants>["variant"];
  /**
   * If true, a loading spinner is displayed on the button.
   */
  loading?: boolean;
  /**
   * If true, the button is disabled.
   */
  disabled?: boolean;
}

/**
 * CustomBtn is a reusable button component with customizable properties.
 *
 * @param {CustomBtnProps} props - The properties to customize the button.
 * @returns {JSX.Element} The customized button element.
 *
 * @example
 * <CustomBtn type="submit" text="Submit" variant="secondary" loading={true} />
 */
const CustomBtn = ({
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  text = "",
  variant = "primary",
}: CustomBtnProps) => {
  return (
    <Button
      variant={variant}
      type={type}
      disabled={loading || disabled}
      className={cn("flex gap-3", className)}
    >
      {text}
      {loading && <LoaderCircle className="animate-spin" />}
    </Button>
  );
};

export default CustomBtn;
