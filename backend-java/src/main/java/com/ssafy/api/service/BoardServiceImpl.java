package com.ssafy.api.service;

import com.ssafy.api.request.BoardRegisterPostReq;
import com.ssafy.api.request.BoardUpdateReq;
import com.ssafy.db.entity.Board;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("boardService")
public class BoardServiceImpl implements BoardService {
    @Autowired
    BoardRepository boardRepository;

    @Override
    public void createBoard(BoardRegisterPostReq boardRegisterPostReq, User user) {
        Board board = new Board();
        board.setUser(user);
        board.setBoardTitle(boardRegisterPostReq.getBoardTitle());
        board.setBoardContent(boardRegisterPostReq.getBoardContent());
        board.setDeadline(boardRegisterPostReq.getDeadline());

        boardRepository.save(board);
    }

    @Override
    public void deleteBoard(Board board) {
        boardRepository.delete(board);
    }

    @Override
    public List<Board> getBoardList() {
        return boardRepository.findAll();
    }

    @Override
    public Board getBoardByBoardSeq(Long boardSeq) {
        Board board = boardRepository.findBoardByBoardSeq(boardSeq).orElse(null);
        return board;
    }

    @Override
    public Board updateBoard(Long boardSeq, BoardUpdateReq boardUpdateReq, User user) {
        Board board = getBoardByBoardSeq(boardSeq);
        board.setUser(user);
        board.setBoardTitle(boardUpdateReq.getBoardTitle());
        board.setBoardContent(boardUpdateReq.getBoardContent());
        board.setDeadline(boardUpdateReq.getDeadline());

        return boardRepository.save(board);
    }

}