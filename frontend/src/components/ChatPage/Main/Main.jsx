import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getDatabase, ref, child, onChildAdded } from "firebase/database";
import Message from "./Message";
import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";

function Main(props) {
  const [messages, setMessages] = useState([]);
  const [state, setState] = useState({
    messagesRef: ref(getDatabase()),
    searchTerm: "",
    searchResults: [],
    searchLoading: false,
  });
  const { searchTerm, searchResults } = state;
  const { setData } = props;
  const scrollRef = useRef();
  const room = useSelector((state) => state.userReducer.chatRoomString);

  // 렌더링 될때마다 db에서 스키마 로딩
  useEffect(() => {
    let isComponentMounted = true;
    if (room && isComponentMounted) {
      addMessageListeners(room[0]);
      setData(messages);
    }
    return () => {
      isComponentMounted = false;
      setMessages([]);
    };
  }, [room]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    let isComponentMounted = true;
    if (searchTerm && isComponentMounted) {
      handleSearchMessages();
    }
    return () => {
      isComponentMounted = false;
    };
  }, [searchTerm]);

  function changeStr(str) {
    const specials = /[.*+?|()[\]{}\\]/g;
    return str.replace(specials, "\\$&");
  }

  const handleSearchMessages = () => {
    if (searchTerm) {
      const chatRoomMessages = [...messages];
      const str = changeStr(searchTerm);
      const regex = new RegExp(str, "gi");
      const searchResults = chatRoomMessages.reduce((acc, message) => {
        if (message.contents && message.contents.match(regex)) {
          acc.push(message);
        }
        return acc;
      }, []);

      setState({ searchResults });
    }
  };

  const handleSearchChange = (event) => {
    setState({ searchTerm: event.target.value });
  };

  const renderMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message key={message.timestamp} message={message} />
    ));
  useEffect(() => {
    let isComponentMounted = true;
    if (isComponentMounted) {
      scrollToBottom();
    }
    return () => {
      isComponentMounted = false;
    };
  }, [renderMessages]);

  // 데이터 스냅샷을 이용해서 DB에서 스키마를 가지고 조작

  function addMessageListeners(room) {
    const messagesArray = [];
    onChildAdded(
      child(ref(getDatabase(), "messages"), `${room}/message`),
      (DataSnapshot) => {
        const messages = DataSnapshot.val();
        messagesArray.push(messages);
        setMessages(messagesArray);
      }
    );
  }

  return (
    <div style={{ padding: "2rem 2rem 0 2rem" }}>
      <MessageHeader
        handleSearchChange={handleSearchChange}
        value={searchTerm}
      />
      <div
        style={{
          width: "100%",
          height: "40em",
          border: ".2rem solid #ececec",
          backgroundColor: "#74b9ff",
          borderRadius: "10px",
          marginBottom: "1rem",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        ref={scrollRef}
      >
        {searchResults !== undefined && searchResults.length !== 0
          ? renderMessages(searchResults)
          : renderMessages(messages)}
      </div>

      <MessageForm />
    </div>
  );
}

export default Main;
