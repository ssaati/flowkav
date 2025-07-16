package ir.jaryan.form.result;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "tb_form_result_item")
public class FormResultItemEntity {

    // UUID identifier
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    @Column(name = "field")
    private String field;

    @Column(name = "value")
    private String value;

    // Many-to-one association back to the parent SurveyResultEntity.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private FormResultEntity formResultEntity;

    public FormResultItemEntity() {
    }

    public FormResultItemEntity(String field, String value) {
        this.field = field;
        this.value = value;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public FormResultEntity getFormResultEntity() {
        return formResultEntity;
    }

    public void setFormResultEntity(FormResultEntity formResultEntity) {
        this.formResultEntity = formResultEntity;
    }
}
