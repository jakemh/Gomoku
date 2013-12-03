package gomokuproj;

import java.util.ArrayList;
import java.util.List;

public final class Chain {

    public final int length;
    public final int player;
    public final GamePiece head;
    public final GamePiece tail;
    public final Tuple dir;
       
    public Chain(GamePiece head, GamePiece tail, Tuple dir, int length) {
        this.head = head;
        this.tail = tail;
        this.dir = dir;
        this.player = head.player;
        this.length = length;
//        this.dir = this.head.coord.minus(this.tail.coord);
    }

    public Chain(Chain oldC) {
        this.head = oldC.head;
        this.tail = oldC.tail;
        this.dir = oldC.dir;
        this.player = oldC.head.player;
        this.length = oldC.length;
    }

    boolean isSublist(Chain o) {
        return (this.dir.equals(o.dir) || (o.dir.x == 0 && o.dir.y == 0)) && (this.head.coord.equals(o.head.coord) || this.tail.coord.equals(o.tail.coord));
    }

    boolean isReversed(Chain o) {
        return this.head.coord.equals(o.tail.coord) && this.tail.coord.equals(o.head.coord);
    }

    private Object[] winnableHelper(Board b, Tuple thisDir) {
        int frontier = 0;
        int oneDir = 0;
        int oneDirCount = 0;
        int combineDir = 0;
        Tuple inFront = this.head.coord.plus(thisDir);
        Tuple behind = this.tail.coord.minus(thisDir);

        while (b.inRange(inFront) && (b.spaceIsEmpty(inFront) || b.hasPiece(inFront, this.player))) {
            inFront.plusB(thisDir);
            frontier += 1;
            oneDir += 1;
            if (oneDir + this.length == b.winChainLength) {
                oneDirCount+=1;
                break;
            }

        }
        oneDir = 0;

        while (b.inRange(behind) && (b.spaceIsEmpty(behind) || b.hasPiece(behind, this.player))) {
            behind.minusB(thisDir);
            frontier += 1;
            oneDir += 1;
            if (oneDir + this.length == b.winChainLength) {
                oneDirCount += 1;

                break;
            }
        }
        boolean winnable = ((frontier + this.length) >= b.winChainLength);
        Object[] returnArray = {winnable, oneDirCount};
        return returnArray;
    }

    public boolean isWinnable(Board b) {
//        return this.openSides(b) != 0;
        if (this.length > 1) {
            return (boolean)this.winnableHelper(b, this.dir)[0];

        } else {
            return this.winnableDirections(b) > 0;
        }
    }

    public int winnableDirections(Board b) {
        int incr = 0;

        if (this.length == 1) {
            for (int i = 0; i < 4; i++) {
                Tuple thisDir = Constants.LEGAL_DIRS.get(i);
                int count = (int)this.winnableHelper(b, thisDir)[1];
                if (count > 0) {
                    incr += count;
                }
            }
        }
        return incr;
    }

    public int openSides(Board b) {

        int openSides = 0;
        Tuple inFront = this.head.coord.plus(this.dir);
        Tuple behind = this.tail.coord.minus(this.dir);

        if (b.inRange(inFront) && b.spaceIsEmpty(inFront)) {
            openSides += 1;
        }

        if (b.inRange(behind) && b.spaceIsEmpty(behind)) {
            openSides += 1;
        }

        return openSides;
    }
    
    public List getPieceCoords(Board b){
        List l = new ArrayList();
        l.add(this.tail.coord);
        
        Tuple newCoord = this.tail.coord.plus(this.dir);
        l.add(newCoord);
        while (!newCoord.equals(head.coord)){
            newCoord = newCoord.plus(this.dir);
            l.add(newCoord);

        }

        return l;
        
    }

    @Override
    public String toString() {
        return (this.player == 0 ? "X" : "O") + "(" + this.head.coord + this.tail.coord + ") D: " + this.dir + " L: " + this.length;
    }
}
