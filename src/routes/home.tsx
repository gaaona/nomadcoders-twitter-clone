import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import PostTweetFrom from "../components/post-tweet";
import styled from "styled-components";

const Wrapper = styled.div``;

export default function Home() {
  const navigate = useNavigate();
  // const logOut = () => {
  //   auth.signOut();
  //   navigate("/login");
  // };
  return (
    <Wrapper>
      <PostTweetFrom />
    </Wrapper>
  );
}
