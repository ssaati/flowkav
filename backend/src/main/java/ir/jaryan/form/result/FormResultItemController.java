package ir.jaryan.form.result;

import ir.jaryan.form.form.FormEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static org.springframework.data.domain.ExampleMatcher.GenericPropertyMatcher.of;

@RestController
@RequestMapping("api/v1/result-items")
public class FormResultItemController {

    @Autowired
    private FormResultItemRepository formResultItemRepository;

    @GetMapping()
    public ResponseEntity<List<FormResultItemDTO>> getResultItems(
            @RequestParam(required = false) String form,
            @RequestParam(required = false) String field,
            @RequestParam(required = false) String query) {

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withMatcher("value", of(ExampleMatcher.StringMatcher.CONTAINING));
        FormResultItemEntity probe = new FormResultItemEntity();

        if (form != null) {
            FormEntity formEntity = new FormEntity();
            formEntity.setId(form);
            FormResultEntity formResult = new FormResultEntity();
            formResult.setForm(formEntity);
            probe.setFormResultEntity(formResult);
        }
        if (field != null) {
            probe.setField(field);
        }
        if (query != null) {
            probe.setValue(query);
        }
        Example<FormResultItemEntity> example = Example.of(probe, matcher);
        List<FormResultItemEntity> all = formResultItemRepository.findAll(example);
        List<FormResultItemDTO> dtos = new ArrayList<>();
        for (FormResultItemEntity entity : all) {
            dtos.add(new FormResultItemDTO(entity.getId(), entity.getValue()));
        }
        return ResponseEntity.ok().body(dtos);
    }
}
