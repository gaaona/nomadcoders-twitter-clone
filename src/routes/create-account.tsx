import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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
import GithubButton from "../components/github-btn";

// const errors = {
//   "auth/email-already-in-use" : "That email already exists.",
// }

export default function CreateAccount() {
  // return <h1>create account</h1>;

  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name == "name") {
      setName(value);
    } else if (name == "email") {
      setEmail(value);
    } else if (name == "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || name === "" || email === "" || password === "") return; // 필수 값이 비어있거나 아직 로딩중이면 함수 중지
    try {
      setLoading(true);

      // create an account
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user);

      // set the name of the user
      await updateProfile(credentials.user, {
        displayName: name,
      });

      // redirect to the homepage
      navigate("/");
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
    console.log(name, email, password);
  };

  return (
    <Wrapper>
      <Title>Join X</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account? <Link to="/login">Login &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
