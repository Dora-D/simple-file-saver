import { Box, Container } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../hooks/reduxAppHooks";

const Login = () => {
  const { login, navigateToMainPage } = useAuth();
  const isAuthenticated = useAppSelector(({ auth }) => auth.isAuthenticated);

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
