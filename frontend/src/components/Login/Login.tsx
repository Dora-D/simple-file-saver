import { Box, Container } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const { login, isAuthenticated, navigateToMainPage } = useAuth();

  if (isAuthenticated) {
    navigateToMainPage();
  }

  return (
    <Container
      fixed
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box
        width={300}
        height={200}
        border={"1px solid"}
        borderRadius="6px"
        borderColor={"primary.main"}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <GoogleLogin
          onSuccess={login}
          onError={() => {
            console.log("Login Failed");
          }}
          useOneTap
        />
      </Box>
    </Container>
  );
};

export default Login;
