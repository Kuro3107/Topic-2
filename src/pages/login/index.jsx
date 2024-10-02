import AuthenTemplate from "../../components/authen-template";
import { Button, Form, Input } from "antd";
import { getAuth, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { googleProvider } from "../../config/firebase";

function LoginPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLoginWithGoogle = () => {
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        GoogleAuthProvider.credentialFromResult(result);
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        // Xử lý đăng nhập thành công
      })
      .catch((error) => {
        console.log(error);
        // Xử lý lỗi
      });
  };

  const handleLogin = async (values) => {
    try {
      const response = await api.post("/login", values);
      console.log(response);
      toast.success("Login successfully");
      //token
      const { role, token } = response.data;
      localStorage.setItem("token", token);

      if (role === "ADMIN") {
        navigate("/dashboard");
      }
      if (role === "CUSTOMER") {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  return (
    <div>
      <AuthenTemplate>
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleLogin}>
          <Form.Item label="phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Login
          </Button>
          <Button onClick={handleLoginWithGoogle}>Login Google</Button>
          <div>
            <Link to="/register">Don&apos;t have an account?</Link>
          </div>
          <div>
            <Link to="/">back to home page</Link>
          </div>
        </Form>
      </AuthenTemplate>
    </div>
  );
}

export default LoginPage;
