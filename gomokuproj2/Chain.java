package gomokuproj2;

import java.util.ArrayList;
import java.util.List;

public final class Chain {

    public final int length;
    public final int player;
    public final GamePiece head;
    public final GamePiece tail;
    public final Tuple dir;
      
    private boolean _isWinnableCache;
    
    public Chain(GamePiece head, GamePiece tail, Tuple dir, int length) {
        this.head = head;
        this.tail = tail;
        this.dir = dir;
        this.player = head.player;
        this.length = length;
    }

    public Chain(Chain oldC) {
        this.head = oldC.head;
        this.tail = oldC.tail;
        this.dir = oldC.dir;
        this.player = oldC.head.player;
        this.length = oldC.length;
        this._isWinnableCache = oldC._isWinnableCache;
    }

    boolean isSublist(Chain o) {
        return (this.dir.equals(o.dir) 
                || (o.dir.x == 0 && o.dir.y == 0)) 
                    && 
                (this.head.coord.equals(o.head.coord) 
                || this.tail.coord.equals(o.tail.coord));
        
    }
    boolean isSublistReversed(Chain o) {
        return (this.dir.equals(o.dir.mult(-1))
                || (o.dir.x == 0 && o.dir.y == 0))
                && (this.head.coord.equals(o.tail.coord)
                || this.tail.coord.equals(o.head.coord));

    }
    boolean isReversed(Chain o) {
        return this.head.coord.equals(o.tail.coord) && this.tail.coord.equals(o.head.coord);
    }

    private int winnableDirectionsInner(Board b, Tuple thisDir, boolean onlyOne) {
        int oneDir = 0;
        int oneDirCount = 0;
        Tuple inFront = this.head.coord.plus(thisDir);
        Tuple behind = this.tail.coord.minus(thisDir);

        while (b.inRange(inFront) && (b.spaceIsEmpty(inFront) || b.hasPiece(inFront, this.player))) {
            inFront.plusB(thisDir);
            oneDir += 1;
            if (oneDir + this.length == b.winChainLength) {
                oneDirCount+=1;
                if (onlyOne) return 1;
                break;
            }
        }
        
        oneDir = 0;

        while (b.inRange(behind) && (b.spaceIsEmpty(behind) || b.hasPiece(behind, this.player))) {
            behind.minusB(thisDir);
            oneDir += 1;
            if (oneDir + this.length == b.winChainLength) {
                if (onlyOne)return 1;

                oneDirCount += 1;
                break;
            }
        }
        
        return oneDirCount;
    }
    
    private boolean winnableInner(Board b, Tuple thisDir) {
        int frontier = 0;
        Tuple inFront = this.head.coord.plus(thisDir);
        Tuple behind = this.tail.coord.minus(thisDir);

        while (b.inRange(inFront) && (b.spaceIsEmpty(inFront) || b.hasPiece(inFront, this.player))) {
            inFront.plusB(thisDir);
            frontier +=1;
            if (frontier + this.length == b.winChainLength) return true;
        }

        while (b.inRange(behind) && (b.spaceIsEmpty(behind) || b.hasPiece(behind, this.player))) {
            behind.minusB(thisDir);
            frontier += 1;
            if (frontier + this.length == b.winChainLength) return true;
        }
        boolean winnable = ((frontier + this.length) >= b.winChainLength);
        return winnable;
    }
    
    public boolean getIsWinnableCached(){
            return this._isWinnableCache;
    }
    
    public boolean isWinnable(Board b) {

        if (this.length > 1) {
            this._isWinnableCache = this.winnableInner(b, this.dir);
            return this._isWinnableCache;

        } else {
            this._isWinnableCache = this.winnableDirections(b, true) > 0;
            return _isWinnableCache;
        }
    }

    public int winnableDirections(Board b, boolean onlyOne) {
        int incr = 0;

        if (this.length == 1) {
            for (int i = 0; i < 4; i++) {
                Tuple thisDir = Constants.LEGAL_DIRS.get(i);
                int count = this.winnableDirectionsInner(b, thisDir, onlyOne);
                if (count > 0) {
                    if (onlyOne) return count;
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
