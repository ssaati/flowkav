package ir.jaryan.form.formstep;

import ir.jaryan.base.Transferable;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.List;

@Data
@NoArgsConstructor
public class FormStepDTO implements Transferable<Long> {
    Long id;
    public String formId;
    public String name;
    public String formStepType;
    public Long user;
    public List<Long> users;
    public List<String> viewFields;
    public List<String> editFields;

    public FormStepDTO(FormStepEntity entity) {
        setFormId(entity.getForm().getId());
        if(entity.getUser() !=null)
            setUser(entity.getUser().getId());
        if(entity.getStepType() !=null)
            setFormStepType(entity.getStepType().name());
        if(entity.getUsers() != null)
            setUsers(entity.getUsers().stream().map(u -> u.getId()).toList());
        if(entity.getEditFields() !=null)
            setEditFields(Arrays.asList(entity.getEditFields().split(",")));
        if(entity.getViewFields() !=null)
            setViewFields(Arrays.asList(entity.getViewFields().split(",")));
        setId(entity.getId());

    }
}
