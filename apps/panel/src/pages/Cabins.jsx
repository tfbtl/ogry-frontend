import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Col from "../ui/Col";
import CabinTable from "../features/cabins/CabinTable";
import AddCabin from "../features/cabins/AddCabin";
import CabinTableOperations from "../features/cabins/CabinTableOperations";

function Cabins() {
  return (
    <>
      <Col>
        <Heading as="h1">All cabins</Heading>
        <CabinTableOperations />
      </Col>

      <Row>
        <CabinTable />
        <AddCabin />
      </Row>
    </>
  );
}

export default Cabins;
