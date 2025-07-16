package ir.jaryan.form.darkhast;

import ir.jaryan.base.BaseEntity;
import ir.jaryan.usermanagement.user.UserEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.Date;

@Entity
@Table(name = "tb_darkhast")
public class DarkhastEntity extends BaseEntity<String> {

    private UserEntity requestedBy;
    @Column(name = "start_date")
    private Date startDate;
    @Column(name = "end_date")
    private Date endDate;
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    public String getId() {
        return super.getId();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    public UserEntity getRequestedBy() {
        return requestedBy;
    }

    public void setRequestedBy(UserEntity requestedBy) {
        this.requestedBy = requestedBy;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }
}
