import { Box, Container, Stack, Typography } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../hooks/reduxAppHooks";
import { blueGrey, green } from "@mui/material/colors";

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
      <Stack
        width={300}
        border={"1px solid"}
        borderRadius="6px"
        borderColor={blueGrey[100]}
        spacing={2}
      >
        <Stack
          direction={"row"}
          borderBottom={"1px solid"}
          padding={"10px 0"}
          borderColor={blueGrey[100]}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Typography variant="h5" color={green[900]}>
            VrealSoft test task
          </Typography>
        </Stack>
        <Stack alignItems={"center"} spacing={3} pb={"40px"}>
          <Typography variant="body1" color={blueGrey[900]}>
            SignIn/SingUp
          </Typography>
          <GoogleLogin
            onSuccess={login}
            onError={() => {
              console.log("Login Failed");
            }}
            useOneTap
          />
        </Stack>
      </Stack>
    </Container>
  );
};

export default Login;
