package ir.jaryan.form.form;
import ir.jaryan.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository("surveyRepository")
public interface FormRepository extends BaseRepository<FormEntity, String> {
}
