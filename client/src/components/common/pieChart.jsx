import { getOverviewData } from "@/store/overview-slice";
import { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function PieChartComponent() {
  const [hovered, setHovered] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOverviewData()).then((data) => {
      if (data?.payload?.success && Array.isArray(data.payload.overview)) {
        toast.success("Analytics Data fetched successfully!");
        processChartData(data.payload.overview[1] || []);
        setShowChart(true);
      } else {
        toast.error("Unable to fetch analytics data!");
      }
      setLoading(false);
    });
  }, [dispatch]);

  const { overviewData } = useSelector((state) => state.overview);


  const processChartData = (orders) => {
    if (!Array.isArray(orders) || orders.length === 0) return;

    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
    
    const formattedData = orders.map((item, index) => ({
      title: item._id || "Unknown",
      value: item.count || 0,
      color: colors[index % colors.length],
    }));

    setChartData(formattedData);
  };

  return (
    <div className="relative w-80 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-1">Orders Breakdown</h2>
      <p className="text-sm text-gray-600 mb-4">
        Visual representation of orders by status
      </p>

      {loading ? (
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      ) : (
        showChart && chartData.length > 0 ? (
          <div className="transition-opacity duration-1000 opacity-100">
            <PieChart
              className="cursor-pointer"
              data={chartData}
              animate
              animationDuration={1000}
              animationEasing="ease-out"
              lineWidth={50}
              radius={42}
              label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
              labelStyle={{
                fontSize: "6px",
                fontFamily: "sans-serif",
                fill: "#fff",
              }}
              labelPosition={75}
              onMouseOver={(_, index) => setHovered(index)}
              onMouseOut={() => setHovered(null)}
            />

            {hovered !== null && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-black px-3 py-1 rounded-md shadow-md">
                <p className="text-sm font-semibold">{chartData[hovered].title}</p>
                <p className="text-xs">Orders: {chartData[hovered].value}</p>
              </div>
            )}

            <div className="mt-4 flex gap-4 justify-center">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No order data available.</p>
        )
      )}
    </div>
  );
}

export default PieChartComponent;
