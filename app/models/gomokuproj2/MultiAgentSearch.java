package gomokuproj;

import gomokuproj.evaluation.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Random;


public class MultiAgentSearch {

    

    public Board board;
    int movesConsidered = Constants.MOVES_CONSIDERED;
    int maxDepth = Constants.DEPTH_DEFAULT;
    int winChain = Constants.CHAIN_SIZE_DEFAULT;
    
    
    public MultiAgentSearch() {
        this.board = new Board(Constants.BOARD_SIZE_DEFAULT, Constants.CHAIN_SIZE_DEFAULT);
//        this.board = Board.buildFromInput("3");
    }
    public MultiAgentSearch(Board b, Map<String, Integer> options) {
            System.out.println("***MULTI: " + options.toString());
            System.out.println("***DEPTH: " + options.get("maxDepth"));
            System.out.println("***DEPTH2: " + (options.containsKey("maxDepth") ? options.get("maxDepth") : this.maxDepth));

//        this.board = new Board(Constants.BOARD_SIZE_DEFAULT, Constants.CHAIN_SIZE_DEFAULT);
          this.board = b;
          
          this.maxDepth = options.containsKey("maxDepth") ? options.get("maxDepth") : this.maxDepth;

          this.movesConsidered = options.containsKey("movesConsidered") ?  options.get("movesConsidered") : this.movesConsidered;
          this.winChain = options.containsKey("winChain") ? options.get("winChain") : this.winChain;
//        this.board = Board.buildFromInput("3");
    }
    
    public  Pair getBestMove(int player){
//        int depth = options.get("depth");
//        int movesConsidered = options.get("movesConsidered");
//        int winChain = options.get("winChain");
//        MultiAgentSearch m = new MultiAgentSearch(b, options);
        return this.minMaxAB(board, 1, player, Constants.LOSE_SCORE, Constants.WIN_SCORE);
    }
    
    Pair minMaxAB(Board b, int depth, int player, int alpha, int beta) {
        if (b.isLose() || b.isWin() || depth == this.maxDepth + 1){ 
            return new Pair(new Evaluation(b).eval(), null);
        }
        Pair val = player == b.currentPlayer ? new Pair(Integer.MIN_VALUE, null) : new Pair(Integer.MAX_VALUE, null);


//        for (Pair moveScore : this.topLegalMoves(b, player, Constants.MOVES_CONSIDERED)) {
        List<Pair> legalMoves = this.topLegalMoves(b, player, this.movesConsidered);
        for (int i = 0; i < legalMoves.size(); i++){
            Pair moveScore = legalMoves.get(i);
            Tuple move = moveScore.coord;
//        for (Tuple move : this.getLegalMoves(b)){
            Board nextState = this.getSuccessor(b, move, player);
            if (player == b.currentPlayer) {
                Pair v = minMaxAB(nextState, depth +1 , (player + 1) % 2, alpha, beta);
                if (v.score > val.score )
                    val = new Pair(v.score, move);
                if (v.score > beta) 
                    return new Pair(v.score, move);
                alpha = Math.max(alpha, v.score);
                
            } else {
                Pair v = minMaxAB(nextState, depth + 1, (player + 1) % 2, alpha, beta);
                if (v.score < val.score) 
                    val = new Pair(v.score, move);
                if (v.score < alpha) 
                    return new Pair(v.score, move);
                beta = Math.min(beta, v.score);
            }
        }
        
        if (val.coord == null) val.score = 0;
//        System.out.println("val: " + val);
        return val;

    }
   
    public Board getSuccessor(Board b, Tuple move, int player){
        Constants.counter += 1;
        Board boardCopy = new Board(b);
        GamePiece newPiece = boardCopy.addPiece(move, player);
        boardCopy.parent = b;
//        if (boardCopy.currentPlayer == 1 && player == boardCopy.p1() && new Random().nextInt(101) % 100 == 0){
//            boardCopy.print();
//            System.out.println("X: " + boardCopy.chainLists.get(0).toString());
//            System.out.println(")O: " + boardCopy.chainLists.get(1).toString());
//            if (!boardCopy.chainLists.get(1).isEmpty())
//                System.out.println("st: " + boardCopy.chainLists.get(1).get(0).player);
//
//            int score = Heuristic.evaluate(boardCopy);
//            System.out.println("score: " + score);

//        }
        
        return boardCopy;
    }

    public List<Object> legalMovePairs(Board b, final int player){
        final MultiAgentSearch m = this;
       return this.legalMoves(b, new MoveType() {

            @Override
            public Pair execute(Board b, Tuple c) {
                Board tempOBoard = m.getSuccessor(b, c, player);
                Pair pair = new Pair(new Evaluation(tempOBoard).eval(), c);
//                System.out.println("pair: " + pair);
                return pair;
            }
        });
    }
    
    public List<Pair> topLegalMoves(Board b, int player, int quant){
     List l = this.legalMovePairs(b, player);
        
        Collections.sort(l, new Comparator<Pair>() {
            @Override
            public int compare(Pair o1, Pair o2) {
                return o2.score - o1.score;
            }
        });
        int cutVal = l.size() > quant ? quant  : l.size();
        if (player == b.currentPlayer){
            return l.subList(0, cutVal);
            
        } else{
            List l2 =l.subList(l.size() - cutVal, l.size());
            Collections.reverse(l2);
            return l2;
            
        }
    }
    
    public List legalMoves(Board b, MoveType f) {
        List moves = new ArrayList();
        for (int i = 0; i < b.rows; i++) {
            for (int j = 0; j < b.rows; j++) {
                GamePiece p = b.board[i][j];
                if (b.spaceIsEmpty(new Tuple(i, j))) {
                    moves.add(f.execute(b, new Tuple(i, j)));
                }
            }
        }

        return moves;
    }
    
     public List<Tuple> getLegalMoves(Board b){
       return (List<Tuple>)this.legalMoves(b, new MoveType() {
            @Override
            public Tuple execute(Board b, Tuple c) {
                return c;
            }
        });
    }
    
     
    public void playSelf(){
        int player = 0, pieceCount = 0;
        boolean firstMove = true;
        while (true) {
            if (this.board.isWin() || this.board.isLose()) {
                System.out.println("WINNER!");
                break;
            } else if (pieceCount == Math.pow(this.board.rows, 2)){
                System.out.println("TIE!");
                break;

            }
            Tuple move;
            Pair pair;
            if (firstMove){
                 pair = new Pair(0, new Tuple((this.board.rows) / 2, (this.board.rows) / 2));
                 firstMove = false;
            } else
               pair = this.minMaxAB(this.board, 1, player, -9999, 9999);
               
            System.out.println("Pair: " + pair + " expanded: " + Constants.counter);
            Constants.counter = 0;
            this.board.addPiece(pair.coord, player);
            this.board.print();
            player = (player + 1) % 2;
            this.board.currentPlayer = player;
            pieceCount++;

        }
    }
    
    public void playHumanInner(boolean webOutput, int player, BufferedReader br) throws IOException{
       

        Tuple move;
        Pair pair;
        if (player == 1) {
            pair = this.minMaxAB(this.board, 1, player, Integer.MIN_VALUE, Integer.MAX_VALUE);
        } else {
            System.out.print("Enter move (ex.[2,5]): ");
            String moveString = br.readLine();
//            String moveString = moveInput;
            String[] resultsUnformatted = moveString.split(","), moveCoords = new String[2];
            for (int i = 0; i < 2; i++) {
                moveCoords[i] = resultsUnformatted[i].replaceAll("(\\W)", "");
            }
            pair = new Pair(0, new Tuple(Integer.parseInt(moveCoords[0]), Integer.parseInt(moveCoords[1])));

        }

        this.board.addPiece(pair.coord, player);
        if (!webOutput) {
            System.out.println("Pair: " + pair + " expanded: " + Constants.counter);
            this.board.print();
        } else {
            System.out.println(pair.coord);

        }
        Constants.counter = 0;
        this.board.currentPlayer = player;
    }
    
     public void playHuman(boolean webOutput) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String moveInput = null;
        int player = 0;

        while (true) {
            if (this.board.isWin() || this.board.isLose()) {
                break;
            }
            playHumanInner(webOutput, player,  br);
            player = (player + 1) % 2;

        }

    }
}