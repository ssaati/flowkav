package ir.jaryan.form.result;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import ir.jaryan.form.cartable.CartableEntity;
import ir.jaryan.form.cartable.CartableRepository;
import ir.jaryan.form.cartable.CartableService;
import ir.jaryan.form.cartable.CartableStatus;
import ir.jaryan.form.darkhast.DarkhastEntity;
import ir.jaryan.form.darkhast.DarkhastRepository;
import ir.jaryan.form.form.FormEntity;
import ir.jaryan.form.form.FormRepository;
import ir.jaryan.form.formstep.FormStepEntity;
import ir.jaryan.form.formstep.FormStepType;
import ir.jaryan.usermanagement.user.UserEntity;
import ir.jaryan.usermanagement.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("api/v1/results")
public class FormResultController {
    @Autowired
    FormRepository formRepository;

    @Autowired
    FormResultRepository resultRepository;

    @Autowired
    CartableRepository cartableRepository;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    CartableService cartableService;

    @Autowired
    DarkhastRepository darkhastRepository;

    @Autowired
    UserService userService;

    @PostMapping("cartable")
    public ResponseEntity<FormResultDTO> postFromCartable(@RequestBody FormResultDTO dto){
        Optional<CartableEntity> cartableOptional = cartableRepository.findById(dto.getCartableId());
        CartableEntity cartableEntity = cartableOptional.get();
        FormEntity form = cartableEntity.getForm();
        FormResultEntity formResult = saveFormResult(dto, form);
        cartableService.addToCartable(dto.getCartableId(), formResult, form);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<FormResultDTO> post(@RequestBody FormResultDTO dto){
        Optional<FormEntity> formEntity = formRepository.findById(dto.getFormId());
        FormEntity form = formEntity.get();
        FormResultEntity formResult = saveFormResult(dto, form);
        cartableService.addToCartable(null, formResult, form);
        return ResponseEntity.ok(dto);
    }

    private FormResultEntity saveFormResult(FormResultDTO dto, FormEntity form) {
        FormResultEntity formResult = new FormResultEntity();
        formResult.setForm(form);
        formResult.setPostId(dto.getCartableId());
        for (String fieldName : dto.getData().keySet()) {
            FormResultItemEntity item = new FormResultItemEntity();
            item.setField(fieldName);
            try {
                String value = objectMapper.writeValueAsString(dto.getData().get(fieldName));
                item.setValue(value);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
            formResult.addFormResultItem(item);
        }
        try {
            String json = objectMapper.writeValueAsString(dto.getData());
            formResult.setResultJson(json);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        resultRepository.save(formResult);
        return formResult;
    }

    @GetMapping("/list")
    public ResponseEntity<FormResultsDTO> getResults(@RequestParam(required = false) String formId, @RequestParam(required = false) String postId) {
        Example<FormResultEntity> example = Example.of(new FormResultEntity());
        if (formId != null) {
            FormEntity form = new FormEntity();
            form.setId(formId);
            example.getProbe().setForm(form);
        }
        if (postId != null) {
            example.getProbe().setPostId(postId);
        }
        List<FormResultEntity> allResults = resultRepository.findAll(example);
        FormResultsDTO result= new FormResultsDTO();
        result.setData(new ArrayList<>());
        for (FormResultEntity formResult : allResults) {
            Map<String, String> singleResult = new HashMap<>();
            for (FormResultItemEntity formResultItemEntity : formResult.getFormResultItem()) {
                try {
                    singleResult.put(formResultItemEntity.getField(), objectMapper.readValue(formResultItemEntity.getValue(), String.class));
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            }
            result.getData().add(singleResult);
        }
        return ResponseEntity
                .ok()
                .header("Content-Range", "data " + 0 + "-" + 10 + "/" + 10)
                .body(result);
    }
}
