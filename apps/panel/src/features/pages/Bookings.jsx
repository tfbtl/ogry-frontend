import Heading from "../../ui/Heading";
import Col from "../../ui/Col";
import BookingTable from "../bookings/BookingTable";
import BookingTableOperations from "../bookings/BookingTableOperations";

function Bookings() {
  return (
    <>
      <Col>
        <Heading as="h1">All bookings</Heading>
        <BookingTableOperations />
      </Col>

      <BookingTable />
    </>
  );
}

export default Bookings;
