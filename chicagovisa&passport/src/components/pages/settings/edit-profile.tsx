import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import EditUserDetailsForm from "./edit-user-details-form";
import axiosInstance from "@/lib/config/axios";
import EditPasswordForm from "./edit-password-form";

interface ProfileData {
  firstName: string;
  middleName: string;
  lastName: string;
  password: string;
  email1: string;
  phone1: string;
  email2: string;
  phone2: string;
}

const EditProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email1: "",
    email2: "",
    password: "",
    phone1: "",
    phone2: "",
  });

  const fetchProfile = async () => {
    try {
      const { data } = await axiosInstance.get("/user/account", {
        cache: false,
      });
      if (!data?.success) throw new Error(data?.message);
      setProfile(data.data);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  return profile.firstName ? (
    <div className="mx-auto rounded-lg md:p-8 flex lg:flex-row flex-col md:items-start md:justify-around bg-white w-full p-4 shadow-md">
      <EditUserDetailsForm refetchData={fetchProfile} profile={profile} />
      <div className="border lg:block hidden border-slate-400 min-h-[30rem] w-0 self-center"></div>
      <EditPasswordForm />
    </div>
  ) : (
    <p>Loading</p>
  );
};

export default EditProfile;
