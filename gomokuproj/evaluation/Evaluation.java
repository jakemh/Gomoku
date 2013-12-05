package gomokuproj.evaluation;

import gomokuproj.*;
import java.util.Map;


public class Evaluation extends Heuristic {

    Board b;
    int returnVal = 0;
    int defensiveness = Constants.DEFENSIVE_COEFF;
    int aggressiveness  = Constants.AGGRESSIVE_COEFF;

    public Evaluation(Board b,  Map<String, Integer> options) {
        this.b = b;
        this.aggressiveness = Helpers.getIfHas(options, "aggressiveness", Constants.AGGRESSIVE_COEFF);
        this.defensiveness = Helpers.getIfHas(options, "defensiveness", Constants.DEFENSIVE_COEFF);          this.defensiveness = Helpers.getIfHas(options, "defensiveness", Constants.DEFENSIVE_COEFF);

    }
    /** function returned
     * @return **/
    @Override
    public int onEvaluate() {
        
        this.returnVal -= this.evalTopChains(b.p2(), true) * 2;
        this.returnVal += this.evalTopChains(b.p1(), false) * Constants.AGGRESSIVE_COEFF;
//       this.returnVal -= (proxToCenter());
        return this.returnVal;
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
  
   
    
    int evalTopChains(int player, boolean negative) {
        int tempVal = 0;
        if (b.getChainList(player) != null && b.getChainList(player).size() > 0) {
           
                for (Chain c : b.getChainList(player)) {
                    
                    if (c.isWinnable(this.b)) {
//                        if (c.length == 3){
//                            tempVal += 999999;
//                        }
                        if (c.length > 1){
                            int open = c.openSides(this.b);
                            int lengthDiff = b.winChainLength - c.length;
//                            
                                if (lengthDiff <= 2 && open == 2 && player == b.p2()){ // TEMPORARY HACK FIX

    //                                    tempVal += onWin();
//                                        return onWin() - 1000;
                                } 
                      
                            tempVal += Math.pow(10 / lengthDiff, 2);
//                            tempVal += open;
                            tempVal += Math.pow(open, 3);
                            
                        } else{
                            tempVal += c.winnableDirections(b);
                        }
                    } else{
                        
//                        tempVal -= 10;
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
