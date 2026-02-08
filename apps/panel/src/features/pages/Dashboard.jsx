import DashboardFilter from "../dashboard/DashboardFilter";
import DashboardLayout from "../dashboard/DashboardLayout";
import Col from "../../ui/Col";
import Heading from "../../ui/Heading";

function Dashboard() {
  return (
    <>
      <Col>
        <Heading as="h1">Dashboard</Heading>
        <DashboardFilter />
      </Col>

      <DashboardLayout />
    </>
  );
}

export default Dashboard;
