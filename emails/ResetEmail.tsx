import {
  Html,
  Head,
  Font,
  Section,
  Text,
  Button,
  Row,
  Heading,
} from "@react-email/components";

interface ResetEmailProps {
  username: string;
  token: string;
}

export default function ResetEmail({
  username,
  token,
}: ResetEmailProps) {
  const link = `http://localhost:3000/reset-password/${username}?token=${token}`;
  
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Reset Password</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Section style={{ padding: '20px', fontFamily: 'Roboto, sans-serif' }}>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            You recently requested to reset your password for your account. 
            Click the button below to reset it.
          </Text>
        </Row>
        <Row style={{ margin: '20px 0' }}>
          <Button
            href={link}
            style={{
              backgroundColor: '#61dafb',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              textDecoration: 'none',
            }}
            target="_blank"
          >
            Reset Your Password
          </Button>
        </Row>
        <Row>
          <Text>
            If you did not request a password reset, please ignore this email or contact support if you have questions.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
