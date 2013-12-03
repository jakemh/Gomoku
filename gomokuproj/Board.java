package gomokuproj;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Board extends GameGrid {

    public int winChainLength;
    public List<Integer> largestChains = new ArrayList();
    public List<List<Chain>> chainLists = new ArrayList();
    public int currentPlayer = 0;
    public GamePiece[][] board;
    int pieceCount = 0;

    public GamePiece lastPiece;
    public Board parent;

    Board(int winChainLength) {
        this.chainLists.add(new ArrayList(5));
        this.chainLists.add(new ArrayList(5));
        this.winChainLength = winChainLength;
    }

    public Board(int rows, int winChainLength) {
        this(winChainLength);
        this.rows = rows;
        this.board = this.transpose(this.makeBoard(rows));

    }

    public Board(final Board grid) {
        GamePiece[][] deepCopy = new GamePiece[grid.board.length][grid.board[0].length];
        this.board = deepCopy;
        this.currentPlayer = grid.currentPlayer;

        for (List l : grid.chainLists) {
            this.chainLists.add(new ArrayList(l));
        }

        for (int i = 0; i < deepCopy.length; i++) {
            for (int j = 0; j < deepCopy.length; j++) {
                if (!grid.spaceIsEmpty(new Tuple(i, j))) {
                    this.board[i][j] = new GamePiece(grid.board[i][j]);
                } else {
                    this.board[i][j] = null;
                }
            }
        }
        this.rows = grid.rows;
        this.winChainLength = grid.winChainLength;

    }

    public int p1() {
        return this.currentPlayer;
    }

    public int p2() {
        return (this.currentPlayer + 1) % 2;
    }

    int maxChain(int player) {
        return 0;
    }

    int findChainLength(Tuple coord) {
        GamePiece space = this.getBoard()[coord.x][coord.y];
        int count = 1;

        return count;
    }

    public boolean isLose() {
        if (this.chainLists.get(this.p2()).size() > 0) {

            if (this.chainLists.get(this.p2()).get(0).length == winChainLength) {
                return true;

            }
        }
        return false;
    }

    public boolean isWin() {

//        System.out.println("list: " + this.chainLists.toString());
        if (this.chainLists.get(this.p1()).size() > 0) {
            return this.chainLists.get(this.p1()).get(0).length == winChainLength;
        } else {
            return false;
        }
    }

    void checkChain(GamePiece p, int player) {

        int maxChain = p.maxChain;
        List<GamePiece> chain = new ArrayList();
        if (p.adjSet.size() > 0){
        for (Tuple pCrd : p.adjSet) {
            List<GamePiece> tempChain = new ArrayList();

            Tuple curDir = pCrd.minus(p.coord); // direction from orig to adj piece
            GamePiece tempP = new GamePiece(p);
            GamePiece head = null, tail = null;

               if (p.adjSet.contains(p.coord.minus(curDir))) { // check both directions
                while (true) {
                    Tuple crd = tempP.coord.minus(curDir);
                    if (tempP.adjSet.contains(crd)) {
                        tempP = this.getPieceAt(crd);
                        tempChain.add(tempP);
                    } else {
                        tail = tempP;
                        break;
                    }
                }
                tempP = p; //reset piece we iterate back to orig
            } else {
                tail = p;
            }
            //count 1 directionad
            if (p.adjSet.contains(p.coord.plus(curDir))) {
                while (true) {
                    Tuple crd = (tempP.coord.plus(curDir));
                    if (tempP.adjSet.contains(crd)) {
                        tempP = this.getPieceAt(tempP.coord.plus(curDir));
                        tempChain.add(tempP);
                    } else {
                        head = tempP;
                        break;
                    }
                }
            } else {
                head = p;
            }

            tempChain.add(p);
            this.addChain(new Chain(head, tail, curDir, tempChain.size()), player);
            setMaxChains(tempChain);
        }
        }else{
            this.addChain(new Chain(p, p, new Tuple(0,0), 1), player);

        }

    }

    void addChain(Chain newC, int player) {
        Chain deleteChain = null;
        List<Chain> l = this.chainLists.get(player);
        for (Chain c : l) {
            if (newC.isSublist(c) || newC.isReversed(c)) {
                deleteChain = c;
                break;
            }
        }
        if (deleteChain != null) {
            l.remove(deleteChain);
        }

        l.add(newC);
        this.sortList(l);
    }

    void setMaxChains(List<GamePiece> chain) {
        for (GamePiece cPiece : chain) {
            cPiece.maxChain = Math.max(chain.size(), cPiece.maxChain);
        }

    }

    GamePiece getPieceAt(Tuple coord) {

        GamePiece p = this.board[coord.x][coord.y];
        if (p instanceof GamePiece) {
            return p;
        } else {
            return null;
        }
    }

    List<Chain> sortList(List l) {
        final Board thisBoard = this;

        Collections.sort(l, new Comparator<Chain>() {

            @Override
            public int compare(Chain o1, Chain o2) {
                boolean win1 = o1.isWinnable(thisBoard);
                boolean win2 = o2.isWinnable(thisBoard);

                if (win1 == win2) {
                    return o2.length - o1.length;
                } else {
                    return Boolean.compare(win2, win1);
                }
            }
        });
        return l;
    }

    public GamePiece addPiece(Tuple coord, int player) {

        return this.addPiece(this.board, coord, player);
    }

    public GamePiece addPiece(GamePiece[][] b, Tuple coord, int player) {
        if (this.spaceIsEmpty(b, coord)) {
            GamePiece p = new GamePiece(coord, player);
            this.lastPiece = p;

            b[coord.x][coord.y] = p;
            
            this.pieceCount += 1;
            
            Tuple orig = coord;
            for (Tuple dir : Constants.LEGAL_DIRS) {
                Tuple newCoord = orig.plus(dir);
                if (this.hasPiece(b, newCoord, player)) {
                    GamePiece touchedP = getPieceAt(newCoord);

                    p.adjSet.add(touchedP.coord);
                    touchedP.adjSet.add(p.coord);

                } else if (this.hasPiece(b, newCoord, (player + 1) % 2)) {
                    GamePiece touchedP = getPieceAt(newCoord);
                    p.adjSetOpp.add(touchedP.coord);
                    touchedP.adjSetOpp.add(p.coord);
                }
            }
            this.checkChain(p, player);

            return p;

        } else {
            try {
                throw new Exception("square already taken");
            } catch (Exception e) {
                Logger.getLogger(Board.class.getName()).log(Level.SEVERE, null, e);
            }

        }

        return null;
    }

    GamePiece[][] getBoard() {
        return this.board;
    }

    GamePiece[][] makeBoard(int rows) {
        GamePiece[][] returnBoard = new GamePiece[rows][rows];
        int middleSquareInt = (rows + 1) / 2;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < rows; j++) {
                returnBoard[i][j] = null;
                Tuple newTup = new Tuple(i, j);

            }
        }
        return returnBoard;
    }

    public List<Chain> getChainList(int player) {
        if (this.chainLists.size() > player) {
            return this.chainLists.get(player);
        } else {
            return null;
        }
    }

    public boolean hasPiece(GamePiece[][] b, Tuple coord, int player) {
        if (this.inRange(coord)) {
            GamePiece currentSpace = b[coord.x][coord.y];
            return currentSpace instanceof GamePiece && currentSpace.player == player;
        } else {
            return false;
        }
    }

    public boolean hasPiece(Tuple coord, int player) {

        return hasPiece(this.board, coord, player);
    }

    public boolean spaceIsEmpty(GamePiece[][] b, Tuple coord) {

        GamePiece currentSpace = b[coord.x][coord.y];
        return currentSpace == null;
    }

    public boolean spaceIsEmpty(Tuple coord) {
        return spaceIsEmpty(this.board, coord);
    }
    
    public String[][] toBasicString(){
        String[][] grid = new String[this.rows][this.rows];
        GamePiece[][] thisBoard = this.transpose(getBoard());
        for (int i = 0; i < this.rows; i++) {
            GamePiece[] row = thisBoard[i];
            for (int j = 0; j < this.rows; j++) {
                GamePiece c = row[j];
                if (c instanceof GamePiece) {
                    if (c.player == 0) {
                       grid[i][j] = Constants.p1;
                    } else {
                        grid[i][j] = Constants.p2;
                    }
                } else {
                       grid[i][j] = " ";
                }
            }
        }
        return grid;
    }
    
    public void print() {

        for (GamePiece[] row : this.transpose(getBoard())) {
            for (GamePiece c : row) {
                if (c instanceof GamePiece) {
                    if (c.player == 0) {
                        System.out.print("[" + Constants.p1 + "]");
                    } else {
                        System.out.print("[" + Constants.p2 + "]");
                    }
                } else {
                    System.out.print("[" + " " + "]");
                }
            }
            System.out.print("\n");
        }
    }
    
    public int getPieceCount(){
        return this.pieceCount;
    }
    
    public boolean boardFull(){
        return this.getPieceCount() == Math.pow(this.rows, 2);
    }
    
    public void printChain() {

        for (GamePiece[] row : this.transpose(getBoard())) {
            for (GamePiece c : row) {
                if (c instanceof GamePiece) {
                    if (c.player == 0) {
                        System.out.print("[" + c.maxChain + c.p1 + "]");
                    } else {
                        System.out.print("[" + c.maxChain + c.p2 + "]");
                    }
                } else {
                    System.out.print("[" + "  " + "]");
                }
            }
            System.out.print("\n");
        }
    }

}
