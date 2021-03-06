import { getDatabase, push, ref, set } from "firebase/database";
import { Timestamp } from "firebase/firestore";

export async function makeUser(email, userNickName, uid) {
  const newEmail = email.replace(".", "");
  const db = getDatabase();
  await set(ref(db, `/users/${uid}`), {
    email: newEmail,
    userNickName,
    dist: false,
  });
}

export async function makeMessage(message, room) {
  const db = getDatabase();
  const user = sessionStorage.getItem("email");
  let timestamp = "";
  timestamp += Timestamp.now().seconds;
  timestamp += Timestamp.now().nanoseconds;

  const msg = {
    timestamp,
    contents: message,
    id: user,
    time: Timestamp.now().seconds,
  };

  await set(push(ref(db, `messages/${room[0]}/message`)), msg);
}

export async function makeRead(room) {
  const db = getDatabase();
  const user = sessionStorage.getItem("email");
  const identity = {
    count: 0,
  };

  await set(ref(db, `messages/${room[0]}/identity`), identity);
}

// 내가 읽으면 내 count 0으로 초기화
export async function zeroRead(room) {
  const db = getDatabase();
  const user = sessionStorage.getItem("email");

  const identity = {
    id: user,
    count: 0,
  };
  await set(ref(db, `messages/${room[0]}/identity`), identity);
}
