package gomokuproj2;
import java.io.IOException;

public class ReadLayout {
    public String fileName = "1";
    
    public ReadLayout(String fileName){
        this.fileName = fileName;
    }
    
    public ReadLayout(){}
    
    public String[] getLayout(String path) throws IOException {
        ReadFile rf = new ReadFile();
        String[] lines = rf.readLines(path + fileName);
        return lines;

    }
    
}