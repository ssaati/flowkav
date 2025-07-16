package ir.jaryan.form.form;

import ir.jaryan.base.BaseEntity;
import ir.jaryan.form.formstep.FormStepEntity;
import ir.jaryan.usermanagement.role.RoleEntity;
import ir.jaryan.usermanagement.user.UserEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
@Table(name = "tb_survey_definition")
public class FormEntity extends BaseEntity<String> {

    @Column(name = "name")
    private String name;

    @Column(name = "json", length = 4000)
    private String json;

    @Column(name = "view_fields")
    private String viewFields;

    @Column(name = "edit_fields")
    private String editFields;

    private List<FormStepEntity> steps;

    private Set<RoleEntity> roles = new HashSet<>();

    private Set<UserEntity> users = new HashSet<>();

    public FormEntity() {
    }

    public FormEntity(String name, String json) {
        this.name = name;
        this.json = json;
    }

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    public String getId() {
        return super.getId();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getJson() {
        return json;
    }

    public void setJson(String json) {
        this.json = json;
    }

    public String getViewFields() {
        return viewFields;
    }

    public void setViewFields(String viewFields) {
        this.viewFields = viewFields;
    }

    public String getEditFields() {
        return editFields;
    }

    public void setEditFields(String editFields) {
        this.editFields = editFields;
    }

    @OneToMany(mappedBy = "form", fetch = FetchType.EAGER)
    @OrderBy("seq")
    public List<FormStepEntity> getSteps() {
        return steps;
    }

    public void setSteps(List<FormStepEntity> steps) {
        this.steps = steps;
    }

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "tb_form_roles",
            joinColumns = @JoinColumn(name = "form_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    public Set<RoleEntity> getRoles() {
        return roles;
    }

    public void setRoles(Set<RoleEntity> roles) {
        this.roles = roles;
    }

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "tb_form_users",
            joinColumns = @JoinColumn(name = "form_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    public Set<UserEntity> getUsers() {
        return users;
    }

    public void setUsers(Set<UserEntity> users) {
        this.users = users;
    }
}
