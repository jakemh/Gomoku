package gomokuproj.evaluation;

import gomokuproj.*;


public class Evaluation extends Heuristic {

    Board b;
    int returnVal = 0;

    public Evaluation(Board b) {
        this.b = b;
    }

    @Override
    public boolean isWin() {
        return b.isWin();
    }

    @Override
    public int onWin() {
        return this.returnVal += Constants.WIN_SCORE;
    }

    @Override
    public boolean isLose() {
        return b.isLose();
    }

    @Override
    public int onLose() {
        return this.returnVal += Constants.LOSE_SCORE;
    }
  
    @Override
    public int onEvaluate() {
        
        this.returnVal -= this.evalTopChains(b.p2()) * Constants.DEFENSIVE_COEFF;
        this.returnVal += this.evalTopChains(b.p1()) * Constants.AGGRESSIVE_COEFF;
//       this.returnVal -= (proxToCenter());
        return this.returnVal;
    }
    
    int evalTopChains(int player) {
        int tempVal = 0;
        if (b.getChainList(player) != null && b.getChainList(player).size() > 0) {
            if (!b.getChainList(player).get(0).isWinnable(b)) {
                tempVal -= 10;
            } else {
                for (Chain c : b.getChainList(player)) {
                    
                    if (c.isWinnable(this.b)) {
                        if (c.length > 1){
                        int open = c.openSides(this.b);
                        int lengthDiff = c.length - b.winChainLength;
                        tempVal += Math.pow(10 / lengthDiff, 2);
                        tempVal += Math.pow(open, 3);
                        } else{
                            tempVal += c.winnableDirections(b);
                        }
                    }
                }
            }
        } else {
            tempVal -= 10;
        }
        return tempVal;
    }
    
    public int proxToCenter(){
      return Math.abs(b.center.x - b.lastPiece.coord.x) +  Math.abs(b.center.y - b.lastPiece.coord.y);
    }
    


   

}
