import {
  GithubAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import React from "react";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.span`
  margin-top: 50px;
  background-color: white;
  font-weight: 500;
  width: 100%;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      //   await signInWithRedirect(auth, provider);
      navigate("/");
    } catch (error) {
      // console.error("Error signing in with GitHub:", error);
      console.error(error);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg" alt="GitHub Logo" />
      Continue with GitHub
    </Button>
  );
}
