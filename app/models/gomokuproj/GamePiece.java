package gomokuproj;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

public class GamePiece {
    public Tuple coord;
    public int player;
    public String p1 = "X";
    public String p2 = "O";
    public int maxChain = 1;
//    public Map<Tuple, GamePiece> adjHash = new HashMap(8);
    Set<Tuple> adjSet = new HashSet<>();
    
    Set<Tuple> adjSetOpp = new HashSet<>();

    public GamePiece(Tuple coord, int player){
        this.coord = coord;
        this.player = player;
    }
    
    //copy constructor
    public GamePiece(final GamePiece piece) {
        this.coord = piece.coord;
        this.player = piece.player;
//        this.adjSet = piece.adjSet;
        this.adjSet.addAll(piece.adjSet);
        this.adjSetOpp.addAll(piece.adjSetOpp);

//        this.adjHash = new HashMap(8);
//        this.adjHash = piece.adjHash;
        this.maxChain = piece.maxChain;
    }
    public List<GamePiece> connections = new ArrayList(8);
//    Tuple[] connections = new Tuple[8];
//    public void addAdj(int index, Tuple coord){
//        this.connections.
//    }
    
//    public GamePiece copy(){
//        GamePiece thisPiece = new GamePiece(this.coord, this.player);
//        
//        thisPiece.adjHash = this.adjHash;
//        thisPiece.maxChain = this.maxChain;
//        return this;
//    }
    @Override
    public String toString() {
        String c = this.player == 0 ? p1 : p2;
//        return c;
//        return Integer.toString(this.maxChain);
        return this.coord.toString() + "Adjs: " + this.adjSet + " " + c;
    }
    
}
