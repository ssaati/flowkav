package ir.jaryan.form.result;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormResultItemRepository extends JpaRepository<FormResultItemEntity, String> {
}
