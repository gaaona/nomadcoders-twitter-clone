import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import type { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  photo?: string;
  text: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    // 컴포넌트가 언마운트(이 페이지를 안 보고 있을 때)될 때 구독 해제
    const fetchTweets = async () => {
      // Fetch tweets from the database
      const tweetsQuery = query(
        collection(db, "tweets"), // tweets collection
        orderBy("createdAt", "desc"), // Order by creation time, descending
        limit(25) // Limit to 25 tweets
      );
      /*
        // Fetching tweets once
        const snapshot = await getDocs(tweetsQuery);
        snapshot.docs.forEach((doc) => console.log(doc.data()));
    
        const tweets = snapshot.docs.map((doc) => {
          const { text, createdAt, userId, username, photo } = doc.data();
          return {
            text,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        }); */

      // 실시간으로 tweets를 가져오기
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { text, createdAt, userId, username, photo } = doc.data();
          return {
            text,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe(); // if unsubscribe is true, unsubscribe it
    };
  }, []);
  return (
    <Wrapper>
      {/* {JSON.stringify(tweets)} */}
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
