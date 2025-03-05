import CommonForm from "@/components/common/form";
import Header from "@/components/common/header";
import PieChartComponent from "@/components/common/pieChart";
import { Card } from "@/components/ui/card";
import { loginFormControls } from "@/config";
import { useState } from "react";

const initialState = {
  email: "",
  password: "",
};

function ManagersHome() {

  return (
    <>
      <Header />
      <div className=" flex justify-center items-center min-h-screen">
        <PieChartComponent />
      </div>
    </>
  );
}

export default ManagersHome;
