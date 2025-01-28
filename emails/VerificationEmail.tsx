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
            Thank you for signing up with us. Please use the following
            verification code to complete your registration.
          </Text>
        </Row>
        <Row>
          <Text>Verification code: {verifyCode}</Text>
        </Row>
        <Row>
          <Button
            href={`https://localhost:3000/verify?username=${username}&otp=${verifyCode}`}
            style={{ color: "#61dafb" }}
          >
            Verify Here
          </Button>
        </Row>
      </Section>
    </Html>
  );
}
