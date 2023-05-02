import { useForm } from "react-hook-form";
import { Box, Button, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from 'axios';

const MyForm = styled("form")(({ theme }) => ({
  "& .MuiTextField-root": {
    marginBottom: theme.spacing(2),
  },
  "& .MuiButton-root": {
    marginTop: theme.spacing(2),
  },
  maxWidth: "500px",
  margin: "auto", 
}));

const SignUp = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (userData) => {
    reset({
      email: "",
      password: "",
      username: "",
    });
    
    try {
      await axios.post("http://localhost:8000/auth/register", userData);
      alert("WELCOME ONBOARD!");
    } catch (error) {
      alert("INVALID DATA...");
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component='h1' variant='h5' align='center' sx={{ mt: 1, mb: 3 }}>
        Sign Up
      </Typography>
      <MyForm onSubmit={handleSubmit(onSubmit)}>
        <TextField
          required
          fullWidth
          id='email'
          label='Email Address'
          name='email'
          type='email'
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              message: "Email is not valid.",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          required
          fullWidth
          id='username'
          label='Username'
          name='username'
          type='text'
          {...register("username", {
            required: "Username is required."
          })}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <TextField
          required
          fullWidth
          id='password'
          label='Password'
          name='password'
          type='password'
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 6,
              message: "Password should be at least 6 characters.",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button type='submit' fullWidth variant='contained' color='primary'>
          Sign Up
        </Button>
      </MyForm>
    </Box>
  );
};

export default SignUp;
