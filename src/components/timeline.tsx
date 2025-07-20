import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string;
  text: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const fetchTweets = async () => {
    // Fetch tweets from the database
    const tweetsQuery = query(
      collection(db, "tweets"), // tweets collection
      orderBy("createdAt", "desc") // Order by creation time, descending
    );
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
    });
    setTweets(tweets);
  };
  useEffect(() => {
    fetchTweets();
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
