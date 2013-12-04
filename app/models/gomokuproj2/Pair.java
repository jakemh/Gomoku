package gomokuproj;

public class Pair {
        int score;
        public Tuple coord;
        
        public Pair(int score, Tuple coord){
            this.score = score;
            this.coord = coord;
        }
        
        @Override
         public String toString(){
            return ("(" + this.score + ", " + this.coord + ")");
        }
         
        public int getScore(){
            return this.score;
        }
        
        public Tuple getCoord(){
            return this.coord;
        }
   
}
