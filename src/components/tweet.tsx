import React from "react";
import type { ITweet } from "./timeline";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr; // 3:1 비율로 컬럼을 나눔
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.div`
  font-weight: 600;
  font-size: 15px;
`;
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;
export default function Tweet({ username, text, photo }: ITweet) {
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{text}</Payload>
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo}></Photo>
        </Column>
      ) : null}
    </Wrapper>
  );
}
