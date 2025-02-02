import {
  Button,
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  verifyCode: string;
}

export default function VerificationEmail({
  username,
  verifyCode,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>
          Verification Code
          <Font
            fontFamily="Roboto"
            webFont={{
              url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
            fallbackFontFamily={"sans-serif"}
          />
        </title>
      </Head>
      <Preview>Here&apos;s your verification code: {verifyCode}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for signing up with us. You are just one step away from
            completing your registration.
            <br />
            Please use the following verification code to complete your
            registration.
          </Text>
        </Row>
        <Row>
          <Text>Verification code: {verifyCode}</Text>
        </Row>
        <Row>
          <Button
            href={`https://localhost:3000/verify?username=${username}&verifyCode=${verifyCode}`}
            style={{
              color: "#61dafb",
              backgroundColor: "#282c34",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            type="submit"
          >
            Click here to verify
          </Button>
        </Row>
      </Section>
    </Html>
  );
}
