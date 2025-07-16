package ir.jaryan.base;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;

import java.io.Serializable;

public abstract class BaseEntity<I extends Serializable> implements Transferable<I> {

	protected I id;

	@Override
	public I getId() {
		return id;
	}

	@Override
	public void setId(I id) {
		this.id = id;
	}

	@Override
	public boolean equals(Object object) {
		if (object == null) {
			return false;
		}
		if (object == this) { // Quick return if same object passed.
			return true;
		}
		if (this.getClass().equals(object.getClass())) {
			if (getId() != null) {
				return getId().equals(((BaseEntity<?>) object).getId());
			} else {
				return super.equals(object);
			}
		} else {
			return false;
		}
	}

	@Override
	public int hashCode() {
		return getId() != null ? getId().hashCode() : super.hashCode();
	}

	@Override
	public String toString() {
		return getClass().getSimpleName() + " - id=" + getId();
	}

}
