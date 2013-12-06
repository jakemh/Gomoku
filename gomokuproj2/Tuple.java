package gomokuproj2;

public final class Tuple {

     public int x;
     public int y;

    public Tuple(int x, int y) {
        this.x = x;
        this.y = y;
    }
    
    public Tuple(Tuple t) {
        this.x = t.x;
        this.y = t.y;
    }
    
    public Tuple plus(Tuple other){
        Tuple newTup = new Tuple(this.x + other.x, this.y + other.y);
        return newTup;
    }
    
    public void plusB(Tuple other){
        this.x += other.x;
        this.y += other.y;
    }
    public int dist(Tuple o){
        return (int) Math.hypot(this.x - o.x, this.y - o.y);
    }
    
    public Tuple minus(Tuple other){
      Tuple newTup = new Tuple(this.x - other.x, this.y - other.y);
       return newTup;
    }
    
    public void minusB(Tuple other) {
        this.x -= other.x;
        this.y -= other.y;
    }
    
    public Tuple mult(int m) {
        Tuple newTup = new Tuple(this.x  * m, this.y * m);
        return newTup;
    }
    @Override
    public String toString() {
        return "(" + this.x + ", " + this.y + ")";
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof Tuple)) {
            return false;
        }
        Tuple that = (Tuple) other;
        // Custom equality check here.
        return this.x == that.x && this.y == that.y;
    }

    @Override
    public int hashCode() {
        int hash = 5; 
        hash = 47 * hash + this.x;
        hash = 47 * hash + this.y;
        return hash;
    }

}
