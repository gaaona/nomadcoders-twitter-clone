import { useState } from "react";
import type { ITweet } from "./timeline";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import EditTweetForm from "./edit-tweet-form";

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

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: green;
  color: white;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Tweet({ username, text, photo, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        // 사진도 삭제
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const onEdit = () => setIsEditing((prev) => !prev);

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <EditTweetForm
            text={text}
            photo={photo}
            id={id}
            setIsEditing={setIsEditing}
          />
        ) : (
          <Payload>{text}</Payload>
        )}
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
        {user?.uid === userId ? (
          <EditButton onClick={onEdit}>
            {isEditing ? "Cancel" : "Edit"}
          </EditButton>
        ) : null}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo}></Photo>
        </Column>
      ) : null}
    </Wrapper>
  );
}
