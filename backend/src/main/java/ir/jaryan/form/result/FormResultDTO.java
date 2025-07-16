package ir.jaryan.form.result;

import java.util.Map;

public class FormResultDTO {
    private String cartableId;
    private String formId;
    private Map<String, Object> data;
    private String formResultText;

    public FormResultDTO() {
    }

    public String getCartableId() {
        return cartableId;
    }

    public void setCartableId(String cartableId) {
        this.cartableId = cartableId;
    }

    public String getFormId() {
        return formId;
    }

    public void setFormId(String formId) {
        this.formId = formId;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }

    public String getFormResultText() {
        return formResultText;
    }

    public void setFormResultText(String formResultText) {
        this.formResultText = formResultText;
    }
}
