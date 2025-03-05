import CommonForm from "@/components/common/form";
import Header from "@/components/common/header";
import PieChartComponent from "@/components/common/pieChart";
import { Card } from "@/components/ui/card";
import { loginFormControls, registerFormControls } from "@/config";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const initialState = {
  username: "",
  email: "",
  password: "",
  role: "",
  department: ""

};

function ManagerRegister() {
  const [formData, setFormData] = useState(initialState);

  const onSubmit = async (event) => {
    event.preventDefault();
    const token = JSON.parse(sessionStorage.getItem("token"));
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/auth/register`,
        formData, 
        {
          headers: {
            Authorization: `${token}`,
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Content-Type": "application/json", 
          },
        }
      );
  
      if (response?.data?.success) {
        toast.success("User Registered successfully");
        setFormData(initialState)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };
  

  return (
    <>
    <Header/>
      <div
        className="mt-10 flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 min-h-screen"
      >
        <Card className="px-6 md:px-10 py-10 shadow-lg">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-16">
                Register the Operators
              </h1>
            </div>
            <CommonForm
              formControls={registerFormControls}
              buttonText={"Register"}
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
            />
          </div>
        </Card>
      </div>
    </>
  );
}

export default ManagerRegister;
