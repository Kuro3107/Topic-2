import React from "react";
import AuthenTemplate from "../../components/authen-template";
import { Button, Form, Input } from "antd";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { googleProvider } from "../../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";

function LoginPage() {
  const navigate = useNavigate();
  const handleLoginGoogle = () => {
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        console.log(user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        console.log(error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const handleLogin = async (values) => {
    try {
      const response = await api.post("login", values);
      console.log(response);
      const { role, token } = response.data;
      localStorage.setItem("token", token);

      if (role === "ADMIN") {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <AuthenTemplate>
      <Form
        labelCol={{
          span: 24,
        }}
        onFinish={handleLogin}
      >
        <Form.Item
          label="Phone or Email"
          name="phone"
          rules={[
            {
              required: true,
              message: "Please input your phone or email!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <div>
          <Link to="/register">Don't have account? Register new account</Link>
        </div>

        <Button type="primary" htmlType="submit">
          Login
        </Button>

        <Button onClick={handleLoginGoogle}>Login google</Button>
      </Form>
    </AuthenTemplate>
  );
}

export default LoginPage;
