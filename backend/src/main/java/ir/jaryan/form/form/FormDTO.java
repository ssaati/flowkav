package ir.jaryan.form.form;

import ir.jaryan.base.Transferable;
import ir.jaryan.form.formstep.FormStepDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class FormDTO implements Transferable<String> {
    String name;
    String id;
    Map<String, Object> json;
    String text;
    Boolean designer = false;
    public List<String> viewFields;
    public List<String> editFields ;
    public List<Long> roles = new ArrayList<>();
    public List<Long> users = new ArrayList<>();

    List<FormStepDTO> steps = new ArrayList<>();
    public FormDTO() {
    }

    public FormDTO(FormEntity formEntity) {
        if(formEntity==null)
            return;
        setId(formEntity.getId());
        setName(formEntity.getName());
        setText(formEntity.getJson());
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, Object> getJson() {
        return json;
    }

    public void setJson(Map<String, Object> json) {
        this.json = json;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Boolean getDesigner() {
        return designer;
    }

    public void setDesigner(Boolean designer) {
        this.designer = designer;
    }

    public List<String> getViewFields() {
        return viewFields;
    }

    public void setViewFields(List<String> viewFields) {
        this.viewFields = viewFields;
    }

    public List<String> getEditFields() {
        return editFields;
    }

    public void setEditFields(List<String> editFields) {
        this.editFields = editFields;
    }

    public List<Long> getRoles() {
        return roles;
    }

    public void setRoles(List<Long> roles) {
        this.roles = roles;
    }

    public List<Long> getUsers() {
        return users;
    }

    public void setUsers(List<Long> users) {
        this.users = users;
    }

    public List<FormStepDTO> getSteps() {
        if (steps == null) {
            steps = new ArrayList<>();
        }
        return steps;
    }

    public void setSteps(List<FormStepDTO> steps) {
        this.steps = steps;
    }
}
