package ir.jaryan.base;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;

@NoRepositoryBean
public interface BaseRepository<E extends BaseEntity<I>, I extends Serializable> extends JpaRepository<E, I>, JpaSpecificationExecutor<E>{
}
