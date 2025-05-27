import AppBarChart from "@/components/charts/AppBarChart";
import AppLineChart from "@/components/charts/AppLineChart";
import { PodForm } from "@/components/forms/PodForm";
import LargeDashboardItem from "@/components/LargeDashboardItem";
import SmallDashboardItem from "@/components/SmallDashboardItem";

const Homepage = () => {
  return (
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">


      {/* 🔷 First row: Bar Chart, Line Chart, Pod Form */}
      <SmallDashboardItem>
        <AppBarChart />
      </SmallDashboardItem>

      {/* <LargeDashboardItem className="md:col-span-2"> */}
        <AppLineChart />
      {/* </LargeDashboardItem> */}

      <SmallDashboardItem>
        <PodForm />
      </SmallDashboardItem>
    </div>
  );
};

export default Homepage;
