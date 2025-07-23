import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 0px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none; // 이게 없으면 크기 조절이 됨
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0; // Twitter blue
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function EditTweetForm({ photo, text, id, setIsEditing }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [editTweet, setEditTweet] = React.useState("");
  const [editFile, setEditFile] = React.useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };
  const onEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1 && files[0].size < 1 * 1024 * 1024) {
      setEditFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || editTweet === "" || editTweet.length > 180)
      return;

    try {
      setIsLoading(true);

      const prevTweet = doc(db, "tweets", id);
      await updateDoc(prevTweet, {
        text: editTweet,
      });

      if (editFile) {
        if (photo) {
          // 사진 DB에 올리기
          const originalRef = ref(storage, `tweets/${user.uid}/${id}`);
          const result = await uploadBytes(originalRef, editFile);
          // 사진의 URL을 가져와서 doc에 업데이트
          const url = await getDownloadURL(result.ref);
          updateDoc(prevTweet, {
            photo: url,
          });
        }

        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, editFile);
        // 사진의 URL을 가져와서 doc에 업데이트
        const url = await getDownloadURL(result.ref);
        updateDoc(prevTweet, {
          photo: url,
        });
      }
      setEditTweet("");
      setEditFile(null);
      setIsEditing(false);
    } catch (e) {
      console.error("Error posting tweet:", e);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setEditTweet(text);
  }, [text]);
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={editTweet}
      />
      <AttachFileButton htmlFor={`editFile${id}`}>
        {editFile ? "Photo added ✅" : photo ? "Change photo" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onEditFileChange}
        id={`editFile${id}`}
        type="file"
        accept="image/*"
      />
      <SubmitBtn type="submit" value={isLoading ? "Editing" : "Edit Tweet"} />
    </Form>
  );
}
