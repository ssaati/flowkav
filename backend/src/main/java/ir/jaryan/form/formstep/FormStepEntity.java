package ir.jaryan.form.formstep;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ir.jaryan.base.BaseEntity;
import ir.jaryan.form.form.FormEntity;
import ir.jaryan.usermanagement.user.UserEntity;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Set;

/**
 * A FormStepEntity.
 */
@Entity
@Table(name = "tb_form_step")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FormStepEntity extends BaseEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "seq")
    private Integer seq;

    @Column(name = "view_fields")
    private String viewFields;

    @Column(name = "edit_fields")
    private String editFields;

    @Enumerated(EnumType.STRING)
    @Column(name = "step_type")
    private FormStepType stepType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "organization", "roles" }, allowSetters = true)
    private FormEntity form;

    @ManyToOne(fetch = FetchType.LAZY)
    private UserEntity user;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "tb_formstep_users",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "formstep_id")
    )
    private Set<UserEntity> users;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FormStepEntity id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public FormStepEntity title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getSeq() {
        return seq;
    }

    public void setSeq(Integer seq) {
        this.seq = seq;
    }

    public FormStepType getStepType() {
        return this.stepType;
    }

    public FormStepEntity stepType(FormStepType stepType) {
        this.setStepType(stepType);
        return this;
    }

    public void setStepType(FormStepType stepType) {
        this.stepType = stepType;
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

    public FormEntity getForm() {
        return this.form;
    }

    public void setForm(FormEntity form) {
        this.form = form;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public Set<UserEntity> getUsers() {
        return users;
    }

    public void setUsers(Set<UserEntity> users) {
        this.users = users;
    }

    public FormStepEntity form(FormEntity form) {
        this.setForm(form);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FormStepEntity)) {
            return false;
        }
        return getId() != null && getId().equals(((FormStepEntity) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FormStepEntity{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", stepType='" + getStepType() + "'" +
            "}";
    }
}
