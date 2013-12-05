package gomokuproj;

import java.util.Map;

public class Helpers {
    final static public <T, U> U getIfHas(Map m, T obj, U defaultVal) {
        if (m.containsKey(obj)) {
            return (U) m.get(obj);

        } else {
            return defaultVal;
        }
    }
}
