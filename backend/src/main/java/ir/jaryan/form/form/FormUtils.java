package ir.jaryan.form.form;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class FormUtils {
    public static void filterFormElements(Map json, List<String> viewFields, List<String> editFields) {
        if(viewFields ==null)
            viewFields = new ArrayList<>();
        if(editFields ==null)
            editFields = new ArrayList<>();
        List<Map> pages = (List<Map>) json.get("pages");
        if(pages != null){
            for (Map page : new ArrayList<>(pages)) {
                List<Map> elements = (List<Map>) (page).get("elements");
                if(elements != null){
                    for (Map element : new ArrayList<>(elements)) {
                        if(!editFields.contains(element.get("name").toString())){
                            element.put("readOnly", true);
                            if(!viewFields.contains(element.get("name").toString())){
                                elements.remove(element);
                            }
                        }
                    }
                }
            }
        }
    }
}
