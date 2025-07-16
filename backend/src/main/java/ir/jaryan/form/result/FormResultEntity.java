package ir.jaryan.form.result;

import ir.jaryan.form.form.FormEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_form_result")
public class FormResultEntity {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    @Column(name = "post_id")
    private String postId;

    @Column(name = "result_json", length = 4000)
    private String resultJson;

    @ManyToOne(fetch = FetchType.LAZY)
    private FormEntity form;

    @OneToMany(mappedBy = "formResultEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FormResultItemEntity> formResultItem = new ArrayList<>();

    public FormResultEntity() {
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getResultJson() {
        return resultJson;
    }

    public void setResultJson(String resultJson) {
        this.resultJson = resultJson;
    }

    public FormEntity getForm() {
        return form;
    }

    public void setForm(FormEntity form) {
        this.form = form;
    }

    public List<FormResultItemEntity> getFormResultItem() {
        return formResultItem;
    }

    public void setFormResultItem(List<FormResultItemEntity> formResult) {
        this.formResultItem = formResult;
    }

    public void addFormResultItem(FormResultItemEntity item) {
        item.setFormResultEntity(this);
        formResultItem.add(item);
    }

    public void removeFormResultItem(FormResultItemEntity item) {
        formResultItem.remove(item);
        item.setFormResultEntity(null);
    }
}
