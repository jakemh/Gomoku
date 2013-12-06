package gomokuproj2;
 
import java.util.Arrays;
import java.util.List;

public class Constants {
    
    /******* SET MODE ********/
    public static final String DEFAULT_MODE = "4";

    
    
    public static final int DEPTH_DEFAULT = 8;
    public static final int BOARD_SIZE_DEFAULT = 15;
    public static final int CHAIN_SIZE_DEFAULT = 5;
    public static final int DEFAULT_CURRENT_PLAYER = 1;
    public static final int MOVES_CONSIDERED = 12;
    public static final int TIME_LIMIT = 30;
    
    public static final String p1 = "X";
    public static final String p2 = "O";
    static int NANO_SECONDS_IN_SECOND = 1000000000;

    public static int counter = 0;
    public static final String FILE_PATH = "src/gomokuproj2/input/";
    
    public static final int WIN_SCORE = 9999;
    public static final int LOSE_SCORE = -1 * WIN_SCORE;
    
    public static final int AGGRESSIVE_COEFF = 1;
    public static final int DEFENSIVE_COEFF = 1;
    
    public static final List<Tuple> LEGAL_DIRS = Arrays.asList(new Tuple(0, 1), new Tuple(1, 0), new Tuple(1, 1), new Tuple(-1, 1), new Tuple(0, -1), new Tuple(-1, 0),
            new Tuple(-1, -1), new Tuple(1, -1));

}
