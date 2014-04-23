package gomokuproj2;

import gomokuproj2.evaluation.*;
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
import java.util.Timer;
import java.util.TimerTask;


public class MultiAgentSearch {

    

    public Board board;
    int movesConsidered = Constants.MOVES_CONSIDERED;
    int maxDepth = Constants.DEPTH_DEFAULT;
    int winChain = Constants.CHAIN_SIZE_DEFAULT;
    int aggressiveness = Constants.AGGRESSIVE_COEFF;
    int defensiveness = Constants.DEFENSIVE_COEFF;
    int timeLimit = Constants.TIME_LIMIT;
    
    boolean timesUp = false;
    Map<String, Integer> options;
    
    public MultiAgentSearch() {
        this.board = new Board(Constants.BOARD_SIZE_DEFAULT, Constants.CHAIN_SIZE_DEFAULT);
//        this.board = Bboard.buildFromInput("3");
    }
    public MultiAgentSearch(Board b, Map<String, Integer> options) {
        
          this.board = b;
          this.options = options;
          this.timeLimit = Helpers.getIfHas(options, "timeLimit", Constants.TIME_LIMIT);

          this.maxDepth = Helpers.getIfHas(options, "maxDepth", Constants.DEPTH_DEFAULT);
          this.movesConsidered = Helpers.getIfHas(options, "movesConsidered", Constants.MOVES_CONSIDERED);
          this.winChain = Helpers.getIfHas(options, "winChain", Constants.CHAIN_SIZE_DEFAULT);
    }
    
  
    public  Pair getBestMove(int player){
        return this.minMaxAB(board, 1, player, Constants.LOSE_SCORE, Constants.WIN_SCORE);
    }
    
    public Pair negaMaxWithTimer(Board b){
        final MultiAgentSearch _this = this;
        final Timer t = new Timer(true);
        t.scheduleAtFixedRate(
                new TimerTask() {
                    int i = 0;
                    public void run() {
                        i++;
                        if (i > _this.timeLimit) {
                            _this.timesUp = true;
                            t.cancel();
                        }
                    }
                }, 0, 1000);
        Pair returnVal = (Pair)this.negaMax(b, 1, 1, -9999, 9999, 1);
        t.cancel();
        return returnVal;
    } 
      public Pair minMaxWithTimer(Board b, int depth, int player, int alpha, int beta){
        final MultiAgentSearch _this = this;
        final Timer uploadCheckerTimer = new Timer(true);
        uploadCheckerTimer.scheduleAtFixedRate(
                new TimerTask() {
                    int i = 0;

                    public void run() {
                        i++;
                        if (i > _this.timeLimit) {
                            _this.timesUp = true;
                            uploadCheckerTimer.cancel();

                        }
                    }
                }, 0, 1000);
       Pair returnVal = this.minMaxAB(b, 1, 1, -9999, 9999);
        uploadCheckerTimer.cancel();
        return returnVal;
    } 
    public boolean didTimeExpire(){
        return this.timesUp;
    }
    
    public void forceTimeExpire(){
         this.timesUp = true;
    }
    
    public Object negaMax(Board b, int depth, int player, int alpha, int beta, int color){
        if (b.isLose() || b.isWin() || depth == this.maxDepth + 1 || this.timesUp) {
            return new Evaluation(b, this.options).eval() * color;
        }
        
        int bestVal = Integer.MIN_VALUE;
        Tuple bestMove = null;
        List<Pair> legalMoves = this.topLegalMoves(b, player, this.movesConsidered, depth);
        galMoves = this.getLegalMoves(b);

        for (int i = 0; i < legalMoves.size(); i++) {
            Pair moveScore = legalMoves.get(i);
            Tuple move = moveScore.coord;
            Board nextState = this.getSuccessor(b, move, player);

            int val = -(int)negaMax(nextState, depth + 1, (player + 1) % 2, -beta, -alpha, -color);
            if (val > bestVal ){
                bestVal = val;
                if (player == b.currentPlayer)
                bestMove = move;
            }
            alpha = Math.max(alpha, val);
            if (alpha >= beta ){
                break;
            }
        }
        if (depth == 1){
            if (bestMove == null) {
                bestVal = 0;
                bestMove = this.getLegalMoves(b).get(0);
            }

            return new Pair(bestVal, bestMove);
        }
        
        return bestVal;
    }
    
     public Object negaScout(Board b, int depth, int player, int alpha, int beta, int color){
        if (b.isLose() || b.isWin() || depth == this.maxDepth + 1 || this.timesUp) {
            return new Evaluation(b, this.options).eval() * color;
        }
        
        int bestVal = Integer.MIN_VALUE;
        Tuple bestMove = null;
        List<Pair> legalMoves = this.topLegalMoves(b, player, this.movesConsidered, depth);
     
        for (int i = 0; i < legalMoves.size(); i++) {
            Pair moveScore = legalMoves.get(i);
            Tuple move = moveScore.coord;
            int score;
            Board nextState = this.getSuccessor(b, move, player);
          
            if (i != 0){
                score = -(int)negaScout(nextState, depth + 1, (player + 1) % 2, -alpha - 1, -alpha, -color);
                if (alpha < score && score < beta){
                    score = -(int)negaScout(nextState, depth + 1, (player + 1) % 2, -beta, -alpha, -color);

                }
            }else{
                score = -(int)negaScout(nextState, depth + 1, (player + 1) % 2, -beta, -alpha, -color);
            }
            if (score > alpha){
                alpha = score;
                if (player == b.currentPlayer){
                    bestMove = move;
                }
            }
            
            if (alpha >= beta){
                break;
            }
        }
         if (depth == 1){
            if (bestMove == null) {
                alpha = 0;
                bestMove = this.getLegalMoves(b).get(0);
                System.out.println("*CHOOSING RANDOM MOVE FROM NEGAMAX*");
            }

            return new Pair(alpha, bestMove);
        }
        
         return alpha;
    }
     
    Pair minMaxAB(Board b, int depth, int player, int alpha, int beta) {
     
        if (b.isLose() || b.isWin() || depth == this.maxDepth + 1 || this.timesUp){ 
            return new Pair(new Evaluation(b, this.options).eval(), null);
        }
        Pair val = player == b.currentPlayer ? new Pair(Integer.MIN_VALUE, null) : new Pair(Integer.MAX_VALUE, null);

        List<Pair> legalMoves = this.topLegalMoves(b, player, this.movesConsidered, depth);

        for (int i = 0; i < legalMoves.size(); i++){
            Pair moveScore = legalMoves.get(i);
            Tuple move = moveScore.coord;
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
        return val;

    }
   
    public Board getSuccessor(Board b, Tuple move, int player){
        Constants.counter += 1;
        Board boardCopy = new Board(b);
        GamePiece newPiece = boardCopy.addPiece(move, player);
        boardCopy.parent = b;

        return boardCopy;
    }

    public List<Object> legalMovePairs(Board b, final int player){
        final MultiAgentSearch m = this;
       return this.legalMoves(b, new MoveType() {

            @Override
            public Pair execute(Board b, Tuple c) {
                Board tempOBoard = m.getSuccessor(b, c, player);
                int score = new Evaluation(tempOBoard, m.options).eval();
                int score2 = new Evaluation(tempOBoard, m.options).eval();

                Pair pair = new Pair(score, c);
                tempOBoard.heuristicCache = score;
                return pair;
            }
        });
    }
    
    public List<Pair> topLegalMoves(Board b, int player, int quant, int depth){
     List l = this.legalMovePairs(b, player);
           int cutVal = l.size() > quant ? quant : l.size();

            if (depth == 1){
            }
        Collections.sort(l, new Comparator<Pair>() {
            @Override
            public int compare(Pair o1, Pair o2) {
                return o2.score - o1.score;
            }
        });
        if (player == b.currentPlayer){
            return l.subList(0, cutVal);
            
        } else{
            List l2 =l.subList(l.size() - cutVal, l.size());
            Collections.reverse(l2);
            return l2;
            
        }
    }
    
   
      public List legalMoves2(Board b, MoveType f) {
        List moves = new ArrayList();
        for (int i = b.relevantRange[0]; i < b.relevantRange[2]; i++) {
            
            for (int j =  b.relevantRange[1]; j <  b.relevantRange[3]; j++) {
                GamePiece p = b.board[i][j];
                if (b.spaceIsEmpty(new Tuple(i, j))) {
                    moves.add(f.execute(b, new Tuple(i, j)));
                }
            }
        }
        return moves;
    }
    public List legalMoves(Board b, MoveType f) {
        List moves = new ArrayList();
        for (Tuple coord : b.relevantMoves){
            if (b.spaceIsEmpty(coord)) {
                moves.add(f.execute(b, coord));
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
        this.board.currentPlayer = 0;
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
                  pair = (Pair)this.negaMax(this.board, 1, player, -99999, 99999, 1);

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
