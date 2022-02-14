/* eslint-disable prefer-const */
import React, { useEffect, useState } from "react";
import { MdOutlineFavorite } from "react-icons/md";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";

function Favorited() {
  const [state, setState] = useState({
    likeList: [],
  });
  const isLike = useSelector((state) => state.userReducer.isLikeString);
  const navigate = useNavigate();
  useEffect(() => {
    let completed = false;
    async function get() {
      const result = await axios.get("/board/favorite", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      if (!completed) setState({ likeList: result.data.boardInfos });
    }
    get();
    return () => {
      completed = true;
    };
  }, [isLike]);

  const goToBoard = (boardSeq, boardStatus) => {
    if (!boardStatus) {
      alert("마감이 된 게시물입니다.");
      return;
    }
    navigate(`/board/${boardSeq}`);
  };

  const clearBoard = (e, boardSeq) => {
    e.stopPropagation();
    async function post() {
      const result = await axios.post("/board/favorite", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        boardSeq,
      });

      console.log(result);
    }
    post();
  };

  const renderLikeList = (like) =>
    like.length > 0 &&
    like.map((data) => (
      <li
        key={data.boardSeq}
        style={{
          listStyle: "none",
          padding: 0,
          cursor: "pointer",
          textAlign: "right",
        }}
        aria-hidden="true"
        onClick={() => goToBoard(data.boardSeq, data.boardStatus)}
      >
        <br />
        {/* style={{ padding: 0, cursor: "pointer", textAlign: "right" }} */}
        <div
          style={!data.boardStatus ? { textDecoration: "line-through" } : {}}
        >
          {data.boardTitle}
          <span>
            <Button
              variant="danger"
              style={{ marginLeft: "1em", fontSize: "0.5em", padding: 0 }}
              onClick={(e) => clearBoard(e, data.boardSeq)}
            >
              해제
            </Button>
          </span>
        </div>
      </li>
    ));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "right",
        justifyContent: "right",
        fontSize: "1.5em",
      }}
    >
      <MdOutlineFavorite style={{ marginRight: "0.2em" }} /> Favorite (
      {state.likeList.length})
      <br />
      {renderLikeList(state.likeList)}
    </div>
  );
}

export default Favorited;
