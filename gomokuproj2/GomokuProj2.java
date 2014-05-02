/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gomokuproj2;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

public class GomokuProj2 {

    /**
     * @param args the command line arguments
     */
    static String mode = null;
    static int size;
    static int chain;
    static boolean webOutput = false;
    public static void main(String[] args) throws IOException {
        Runtime.getRuntime().exec("/Users/jh/Developer/ror/gomoku/jupdate.sh");
        
        MultiAgentSearch m = new MultiAgentSearch();
     
        handleArgs(args);
        if (mode == null) mode = Constants.DEFAULT_MODE;
        if (mode.equals("1")) {
            m.playHuman(webOutput);
        } else if (mode.equals("2")) {

        } else if (mode.equals("3")) {
            m.playSelf();

            System.out.println(m.board.chainLists.get(0).get(0).getPieceCoords(m.board));
        } else if (mode.equals("4")) {
                
                    
                    long startTime = System.nanoTime();
                    Map<String, Integer> opt = new HashMap();
                    opt.put("maxDepth", 4);
                    opt.put("movesConsidered", 12);
                    opt.put("aggressiveness", 1);
                    opt.put("defensiveness", 1);
                    opt.put("timeLimit", 15);
                   
                    Board b = Board.buildFromInput("src/gomokuproj2/input/", "3");

                    final MultiAgentSearch testM = new MultiAgentSearch(b, opt);

                    Timer uploadCheckerTimer = new Timer(true);
            uploadCheckerTimer.scheduleAtFixedRate(
                    new TimerTask() {
                        int i = 0;

                        public void run() {
                            i++;
                            if (i > 60)
                                testM.timesUp = true;
                        }
                    }, 0, 1000);

                    long stopTime = System.nanoTime();

            System.out.println("Duration: " + (stopTime - startTime) / (double) Constants.NANO_SECONDS_IN_SECOND + " seconds");
           
       
            
        } else if (mode.equals("5")){
            List l = new java.util.ArrayList();
        }
   
        System.out.println("EXPANDED: " + Constants.counter);

    }

     static void handleArgs(String[] args) {
        try {
            for (String arg : args) {
                String[] opts = arg.split("=");
                String command = opts[0];
                String value = opts[1];

                if (command.equals("--mode")) {
                    mode = value;
                    
                }else if (command.equals("--rows")){
                    size =  Integer.parseInt(value);;
                } else if (command.equals("--chain")){
                    chain = Integer.parseInt(value);
                } else if (command.equals("--web")){
                    if ("true".equals(value)){
                        webOutput = true;
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("usage: java gomokufinal.GomokuProj --mode=<mode 1,2 or3> --rows=<board rows> --chain=<win chain length\n"
                    + "Choices: \n" 
                    + "\tModes: 1 is play against a person ,2 is play against random agent and 3 is play against self\n");
                   
            System.exit(0);
        }
    }

}
