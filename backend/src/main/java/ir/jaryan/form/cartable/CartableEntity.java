package ir.jaryan.form.cartable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ir.jaryan.base.BaseEntity;
import ir.jaryan.form.darkhast.DarkhastEntity;
import ir.jaryan.form.form.FormEntity;
import ir.jaryan.form.formstep.FormStepEntity;
import ir.jaryan.form.result.FormResultEntity;
import ir.jaryan.usermanagement.user.UserEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

/**
 * A Cartable.
 */
@Entity
@Table(name = "tb_cartable")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CartableEntity extends BaseEntity<String> {

    private static final long serialVersionUID = 1L;

    @Column(name = "title")
    private String title;

    @Column(name = "status")
    private String status;

    private UserEntity assignee;

    private UserEntity requestedBy;

    private FormStepEntity step;

    private FormEntity form;

    private FormResultEntity formResult;

    private DarkhastEntity darkhast;

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    public String getId() {
        return super.getId();
    }

    public CartableEntity id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public CartableEntity title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    public UserEntity getRequestedBy() {
        return requestedBy;
    }

    public void setRequestedBy(UserEntity requestedBy) {
        this.requestedBy = requestedBy;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "boss", "organization" }, allowSetters = true)
    public UserEntity getAssignee() {
        return this.assignee;
    }

    public void setAssignee(UserEntity user) {
        this.assignee = user;
    }

    public CartableEntity assignee(UserEntity user) {
        this.setAssignee(user);
        return this;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "form", "user", "role" }, allowSetters = true)
    public FormStepEntity getStep() {
        return this.step;
    }

    public void setStep(FormStepEntity formStep) {
        this.step = formStep;
    }

    public CartableEntity step(FormStepEntity formStep) {
        this.setStep(formStep);
        return this;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    public FormResultEntity getFormResult() {
        return formResult;
    }

    public void setFormResult(FormResultEntity formResult) {
        this.formResult = formResult;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    public FormEntity getForm() {
        return form;
    }

    public void setForm(FormEntity form) {
        this.form = form;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    public DarkhastEntity getDarkhast() {
        return darkhast;
    }

    public void setDarkhast(DarkhastEntity darkhast) {
        this.darkhast = darkhast;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CartableEntity)) {
            return false;
        }
        return getId() != null && getId().equals(((CartableEntity) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cartable{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            "}";
    }
}
