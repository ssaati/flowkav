package ir.jaryan.form.result;

import java.util.List;
import java.util.Map;

public class FormResultsDTO {
    private List<Map<String, String>> data;

    public List<Map<String, String>> getData() {
        return data;
    }

    public void setData(List<Map<String, String>> data) {
        this.data = data;
    }
}
