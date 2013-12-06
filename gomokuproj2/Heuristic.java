package gomokuproj2;

public abstract class Heuristic{
    

    public int eval() {
        if (this.isWin()) 
            return this.onWin();
        else if (this.isLose()) 
            return this.onLose();
        else 
            return this.onEvaluate();
    }

    abstract public boolean isWin();
    abstract public int onWin();
  
    abstract public boolean isLose();
    abstract public int onLose();
    
    abstract public int onEvaluate();

}
