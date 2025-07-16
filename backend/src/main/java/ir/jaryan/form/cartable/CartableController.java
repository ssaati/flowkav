package ir.jaryan.form.cartable;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import ir.jaryan.base.BaseController;
import ir.jaryan.base.BaseRepository;
import ir.jaryan.form.form.FormDTO;
import ir.jaryan.form.form.FormEntity;
import ir.jaryan.form.form.FormUtils;
import ir.jaryan.form.formstep.FormStepDTO;
import ir.jaryan.form.formstep.FormStepEntity;
import ir.jaryan.form.result.FormResultDTO;
import ir.jaryan.form.result.FormResultEntity;
import ir.jaryan.usermanagement.user.UserDTO;
import ir.jaryan.usermanagement.user.UserEntity;
import ir.jaryan.usermanagement.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/cartable")
public class CartableController extends BaseController<CartableEntity, CartableDTO, String> {
    @Autowired
    CartableRepository cartableRepository;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    UserRepository userRepository;

    @Override
    public CartableDTO toDto(CartableEntity entity) {
        CartableDTO dto = new CartableDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setStatus(entity.getStatus());
        if(entity.getForm() != null)
            dto.setForm(getFormDTO(entity.getForm(), entity.getStep()));
        if(entity.getStep() != null)
            dto.setStep(entity.getStep().getTitle());
        if(entity.getFormResult() !=null)
            dto.setResult(getFormResultDTO(entity.getFormResult()));
        if(entity.getRequestedBy()!=null) {
            UserDTO requestedBy = new UserDTO();
            requestedBy.setUsername(entity.getRequestedBy().getUsername());
            dto.setRequestedBy(requestedBy);
        }
        return dto;
    }

    private FormResultDTO getFormResultDTO(FormResultEntity formResult) {
        FormResultDTO dto = new FormResultDTO();
        try {
            if(StringUtils.hasText(formResult.getResultJson())) {
                Map<String, Object> map = objectMapper.readValue(formResult.getResultJson(), new TypeReference<Map<String, Object>>() {});
                dto.setData(map);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return dto;
    }

    private FormDTO getFormDTO(FormEntity form, FormStepEntity step) {
        FormDTO dto = new FormDTO();
        FormStepDTO stepDto = new FormStepDTO(step);
        try {
            if(StringUtils.hasText(form.getJson())) {
                Map<String, Object> json = objectMapper.readValue(form.getJson(), new TypeReference<Map<String, Object>>() {
                });
                FormUtils.filterFormElements(json, stepDto.getViewFields(), stepDto.getEditFields());

                dto.setId(form.getId());
                dto.setName((String) json.get("title"));
                dto.setJson(json);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        return dto;
    }

    @Override
    protected List<CartableEntity> filter(Map<String, String> filter) {
        if(filter!=null) {
            CartableEntity cartableExample = new CartableEntity();
            String status = filter.get("status");
            String form = filter.get("form");
            if(StringUtils.hasText(status)) {
                cartableExample.setStatus(status);
            }
            if(StringUtils.hasText(form)) {
                FormEntity formExample = new FormEntity();
                formExample.setId(form);
                cartableExample.setForm(formExample);
            }

            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            Optional<UserEntity> currentUser = userRepository.findByUsername(username);
            cartableExample.setAssignee(currentUser.get());

            Example<CartableEntity> example = Example.of(cartableExample);
            List<CartableEntity> all = cartableRepository.findAll(example);
            return all;
        }
        return super.filter(filter);
    }

    @Override
    public CartableEntity toEntity(CartableDTO dto, CartableEntity entity) {
        return null;
    }


    @Override
    public BaseRepository<CartableEntity, String> getRepository() {
        return cartableRepository;
    }
}
