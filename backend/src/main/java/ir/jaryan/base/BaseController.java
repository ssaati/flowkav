package ir.jaryan.base;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import ir.jaryan.PageResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.*;

public abstract class BaseController<E extends BaseEntity<I>, T extends Transferable<I>, I extends Serializable>  {

	public static final String SLASH = "/";
	public static final String ID_VAR = "{id}";

	@Autowired
	ObjectMapper objectMapper;

	@GetMapping
	public ResponseEntity<List<T>> getEntities(
			@RequestParam(required = false, name = "filter") String filterStr,
			@RequestParam(required = false, name = "range") String rangeStr,
			@RequestParam(required = false, name="sort") String sortStr) {
		System.out.println(filterStr + rangeStr + sortStr) ;
		Map<String, String> stringListMap = new HashMap();
		if(filterStr != null) {
			try {
				stringListMap = objectMapper.readValue(filterStr, Map.class);
				System.out.println(stringListMap);
			} catch (JsonProcessingException e) {
				throw new RuntimeException(e);
			}
		}
		List<E> entities = filter(stringListMap);
		List<T> dtos = new ArrayList<>();
		for (E user : entities) {
			dtos.add(toDto(user));
		}
		return PageResponseUtil.convert(dtos);
	}

	protected List<E> filter(Map<String, String> filter) {
		List<E> entities = getRepository().findAll();
		return entities;
	}

	@PostMapping
	public T create(@RequestBody T dto) {
		getRepository().save(toEntity(dto, null));
		return dto;
	}

	@PutMapping(value = ID_VAR)
	public ResponseEntity<T> update(@RequestBody T dto, @PathVariable I id) {
		Optional<E> byId = getRepository().findById(id);
		if(byId.isPresent()) {
			E entity = byId.get();
			toEntity(dto, entity);
			getRepository().save(entity);
			return ResponseEntity.ok(dto);
		}else{
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping(value = ID_VAR)
	public T getById(@PathVariable I id) {
		return toDto(getRepository().findById(id).orElseThrow());
	}

	@DeleteMapping(value = ID_VAR)
	public T deleteById(@PathVariable I id) {
		Optional<E> byId = getRepository().findById(id);
		if(byId.isPresent()) {
			E entity = byId.get();
			getRepository().delete(entity);
			return toDto(entity);
		}
		return null;
	}

	public abstract BaseRepository<E, I> getRepository();

	public abstract T toDto(E entity);
	public abstract E toEntity(T dto, E entity);
}
