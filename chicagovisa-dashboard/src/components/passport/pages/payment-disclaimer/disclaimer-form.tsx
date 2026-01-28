"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/services/axios/axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";

const DisclaimerForm: React.FC<{}> = () => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [isDisabled, setIsDisabled] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setIsDisabled(true);
      await axiosInstance.put("/admin/configs/payment-disclaimer", {
        disclaimer: data.disclaimer,
      });
      toast.success("Payment disclaimer updated!");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const fetchTnc = async () => {
    try {
      const response = await axiosInstance.get(
        "/admin/configs/payment-disclaimer"
      );
      setValue("disclaimer", response?.data?.data);
      setIsDisabled(true);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchTnc();
  }, []);
  const verbiageValue = watch("disclaimer", "");

  return (
    <Card className="md:w-2/3">
      <CardContent className="flex flex-col p-4">
        <form
          className="flex h-auto flex-col gap-4 py-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex justify-between whitespace-nowrap"></div>

          <small>
            Eg: Use <strong>{`{amount}`}</strong> to represent the total amount.
          </small>
          <Textarea
            placeholder="Enter disclaimer here"
            {...register("disclaimer", {
              onChange: (e) => {
                setIsDisabled(false);
              },
            })}
            className="my-0 w-80 md:w-full"
          />
          <div className="rounded border bg-gray-100 p-4">
            <span>
              <span className="font-semibold"> Preview:</span>{" "}
              {renderPreview(verbiageValue, 100)}
            </span>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-1/3"
              disabled={isDisabled || !watch("disclaimer")}
            >
              Update
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DisclaimerForm;

function renderPreview(template: string, amount: number) {
  return template
    .replace("{amount}", `$${amount.toFixed(2)}`) // Replace {amount}
    .split("[CLICK]") // Split text for clickable part
    .map((part, index) => <>{part}</>);
}
