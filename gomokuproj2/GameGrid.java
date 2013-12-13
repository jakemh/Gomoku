package gomokuproj2;

import java.util.Arrays;

public class GameGrid {
    public int rows;
    public Tuple center = new Tuple(this.rows / 2, this.rows / 2);
   
 static Board buildFromInput(String path, String layout) {
        String[] b = layout(path, layout);
        Board b2 = new Board(b.length, Constants.CHAIN_SIZE_DEFAULT);
        gridFromStringArray(b, b2);
       return b2;
    }

 static void gridFromStringArray(String[] b, Board b2){
     for (int i = 0; i < b.length; i++) {
         String row = b[i];
         for (int j = 0, k = 0; j < b.length * 3; j++) {
             String piece = String.valueOf(row.charAt(j));
             if (Constants.p1.equals(piece) || piece.equals(Constants.p2) || (" ").equals(piece)) {
                 if (!" ".equals(piece)) {
                     b2.addPiece(new Tuple(k, i), piece.equals(Constants.p1) ? 0 : 1);
                 }
                 k++;
             }
         }
     }
 }
 
 static void gridFrom2DStringArray(String[][] b, Board b2){
     for (int i = 0; i < b.length; i++) {
         String[] row = b[i];
         for (int j = 0; j < b.length; j++) {
             String piece = b[i][j];
                 if (!" ".equals(piece)) {
                     b2.addPiece(new Tuple(j, i), piece.equals(Constants.p1) ? 0 : 1);
             }
         }
     }
 }
 
    static String[] layout(String path,String map) {
        String[] layout = null;
        try {
            layout = new ReadLayout(map).getLayout(path);
        } catch (java.io.IOException e) {
            System.err.println("Error: " + e.getMessage());
        }
        return layout;
    }
    
    
    public boolean inRange(Tuple coord) {
        return (coord.x < this.rows && coord.y < this.rows && coord.x >= 0 && coord.y >= 0);
    }
  public GamePiece[][] transpose(GamePiece[][] m) {
        GamePiece[][] temp = new GamePiece[m[0].length][m.length];
        for (int i = 0; i < m.length; i++) {
            for (int j = 0; j < m[0].length; j++) {
                temp[j][i] = m[i][j];
            }
        }
        return temp;
    }
}
