/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gomokuproj;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class GomokuProj {

    /**
     * @param args the command line arguments
     */
    static String mode = null;
    static int size;
    static int chain;
    static boolean webOutput = false;
    public static void main(String[] args) throws IOException {
        MultiAgentSearch m = new MultiAgentSearch();
        handleArgs(args);
        if (mode == null) mode = Constants.DEFAULT_MODE;
        if (mode.equals("1")) {
            m.playHuman(webOutput);
        } else if (mode.equals("2")) {

        } else if (mode.equals("3")) {
            m.playSelf();
//            for (Chain c : m.board.chainLists.get(0)) {
//                System.out.println(c.getPieceCoords(m.board));
////
//            }
            System.out.println(m.board.chainLists.get(0).get(0).getPieceCoords(m.board));
        } else if (mode.equals("4")) {
            
//            b.printChain();
//            for (Chain c : b.chainLists.get(0)){
//                System.out.println("chain: " + c.toString() + " Open: " + c.isWinnable(b));
//                System.out.println(c.winnableDirections(b));
//
//            }
                    long startTime = System.nanoTime();
//                    b.currentPlayer = 1;
//            System.out.println(m.minMaxAB(b, 1, b.currentPlayer, -Constants.WIN_SCORE, Constants.WIN_SCORE));
//            b.print();
                    Board b = Board.buildFromInput("3");
                    long stopTime = System.nanoTime();

            System.out.println("Duration: " + (stopTime - startTime) / (double) Constants.NANO_SECONDS_IN_SECOND + " seconds");
           
       
            
        } else if (mode.equals("5")){
            List l = new java.util.ArrayList();
        }

        System.out.println("EXPANDED: " + Constants.counter);
//        String path = ".";
//
//        String files;
//        File folder = new File(path);
//        File[] listOfFiles = folder.listFiles();
//        System.out.println("DIR: " + Arrays.toString(listOfFiles));
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
