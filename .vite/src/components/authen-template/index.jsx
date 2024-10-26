import React from "react";
import "./index.css";
import { Form } from "antd";

function AuthenTemplate({ children }) {
  return (
    <div className="auth-template">
      <div className="auth-template-form">{children}</div>
    </div>
  );
}

export default AuthenTemplate;
