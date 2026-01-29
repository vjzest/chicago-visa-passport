"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/services/axios/axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";

const TNCForm: React.FC<{}> = () => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [isDisabled, setIsDisabled] = useState(false);
  const [expand, setExpand] = useState(false);
  const [tnc, setTnc] = useState("");

  const onSubmit = async (data: any) => {
    try {
      data.tnc = tnc; // Adding the tnc state to the form data
      setIsDisabled(true);
      await axiosInstance.put("/admin/configs/terms-and-conditions", {
        content: data.tnc,
        verbiage: data.Verbiage,
      });
      toast.success("Terms and conditions updated!");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const fetchTnc = async () => {
    try {
      const response = await axiosInstance.get(
        "/admin/configs/terms-and-conditions"
      );
      setTnc(response?.data?.data?.content);
      setValue("Verbiage", response?.data?.data?.verbiage);
      setExpand(true);
      setIsDisabled(true);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchTnc();
  }, []);
  const verbiageValue = watch("Verbiage", "");

  return (
    <Card className="md:w-2/3">
      <CardContent className="flex flex-col p-4">
        <form
          className="flex h-auto flex-col gap-4 py-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex justify-between whitespace-nowrap">
            <label htmlFor="user-tnc">Terms and conditions</label>
            {expand ? (
              <button type="button" onClick={() => setExpand(false)}>
                <i className="bx bx-collapse-alt text-lg"></i>
              </button>
            ) : (
              <button type="button" onClick={() => setExpand(true)}>
                <i className="bx bx-expand-alt text-lg"></i>
              </button>
            )}
          </div>
          <ReactQuill
            value={tnc}
            onChange={(value) => {
              setTnc(value);
              setIsDisabled(false);
            }}
            theme="snow"
            className={`w-full ${expand ? "mb-16 h-80" : "h-fit min-h-32"}`}
          />

          <label htmlFor="user-tnc">Verbiage</label>
          <small>
            Eg: Use <strong>{`{amount}`}</strong> to represent the total amount,
            and <strong>[CLICK]</strong>{" "}
            {`to represent a clickable "Terms of Use and
            Privacy Policy" link.`}
          </small>
          <Input
            placeholder="Enter verbiage here"
            {...register("Verbiage", {
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
            <Button type="submit" className="w-1/3" disabled={isDisabled}>
              Update
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TNCForm;

function renderPreview(template: string, amount: number) {
  return template
    .replace("{amount}", amount.toFixed(2)) // Replace {amount}
    .split("[CLICK]") // Split text for clickable part
    .map((part, index) => (
      <>
        {part}
        {index === 0 && (
          <span
            className="cursor-pointer font-medium text-blue-500"
            onClick={() => alert("Terms of Use and Privacy Policy Clicked")}
          >
            Terms of Use and Privacy Policy
          </span>
        )}
      </>
    ));
}
