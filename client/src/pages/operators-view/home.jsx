import Header from "@/components/common/header";
import PieChartComponent from "@/components/common/pieChart";


function OperatiosHome() {
    return ( 
        <>
        <Header/>       
        <div className=" flex justify-center items-center min-h-screen">
        <PieChartComponent />
      </div>
        </>

     );
}

export default OperatiosHome;