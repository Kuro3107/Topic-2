import React from 'react';
import AuthenTemplate from '../../components/authen-template';
import { Button, Form, Input } from 'antd';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { googleProvider } from '../../config/firebase';

function LoginPage() {

  const handleLoginWithGoogle = () => {
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

  const handleLogin = () => {

  };


  return (
    <AuthenTemplate>
      <Form
        labelCol={{
          span: 24,
        }}
      >
        <Form.Item
          label="Email or Phone"
          name="emailOrPhone"
          rules={[
            {
              required: true,
              message: "Please input your email or phone!",
            },
            {
              validator: (_, value) => {
                const phoneRegex = /^[0-9]{10}$/; // 10-digit phone number validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // basic email validation

                if (!value) {
                  return Promise.reject("Please input your email or phone!");
                }

                if (phoneRegex.test(value) || emailRegex.test(value)) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  "Please input a valid email or 10-digit phone number!"
                );
              },
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

        <Button>Login</Button>
        <Button onClick={handleLoginWithGoogle}>Login with Google</Button>
      </Form>
    </AuthenTemplate>
  );
}

export default LoginPage;