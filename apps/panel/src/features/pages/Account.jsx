import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import UpdateUserDataForm from "../authentication/UpdateUserDataForm";
import UpdatePasswordForm from "../authentication/UpdatePasswordForm";

function Account() {
  return (
    <>
      <Heading as="h1">Update your account</Heading>

      <Row>
        <Heading as="h3">Update user data</Heading>
        <UpdateUserDataForm />
      </Row>

      <Row>
        <Heading as="h3">Update password</Heading>
        <UpdatePasswordForm />
      </Row>
    </>
  );
}

export default Account;
