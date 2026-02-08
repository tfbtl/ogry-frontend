import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import Col from "../../ui/Col";
import CabinTable from "../cabins/CabinTable";
import AddCabin from "../cabins/AddCabin";
import CabinTableOperations from "../cabins/CabinTableOperations";

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
