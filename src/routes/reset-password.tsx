import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Error,
  Input,
  Switcher,
  Title,
  Wrapper,
  Form,
} from "../components/auth-components";

// const errors = {
//   "auth/email-already-in-use" : "That email already exists.",
// }

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "") return; // 필수 값이 비어있거나 아직 로딩중이면 함수 중지
    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Please check your inbox.");

      // redirect to the login page
      navigate("/login");
    } catch (e) {
      // set error
      // console.log(e);
      if (e instanceof FirebaseError) {
        console.log(e.code, e.message); // code 오류를 잘 볼 것!
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
    console.log(email);
  };

  return (
    <Wrapper>
      <Title>Reset Password</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Reset Password by Email"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account?{" "}
        <Link to="/create-account"> Create One &rarr;</Link>
      </Switcher>
      <Switcher>
        Want to login now? <Link to="/login">Login &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
