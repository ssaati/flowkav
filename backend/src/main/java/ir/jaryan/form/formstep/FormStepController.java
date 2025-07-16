package ir.jaryan.form.formstep;

import ir.jaryan.base.BaseController;
import ir.jaryan.base.BaseRepository;
import ir.jaryan.form.form.FormEntity;
import ir.jaryan.form.form.FormRepository;
import ir.jaryan.usermanagement.user.UserEntity;
import ir.jaryan.usermanagement.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/formsteps")
public class FormStepController extends BaseController<FormStepEntity, FormStepDTO, Long>{
    @Autowired
    FormStepRepository repo;
    @Autowired
    FormRepository formRepo;
    @Autowired
    private UserRepository userRepository;

    @Override
    public BaseRepository<FormStepEntity, Long> getRepository() {
        return repo;
    }

    @Override
    public FormStepDTO toDto(FormStepEntity entity) {
        FormStepDTO dto = new FormStepDTO(entity);
        return dto;
    }

    @Override
    public FormStepEntity toEntity(FormStepDTO dto, FormStepEntity entity) {
        if(entity == null)
            entity = new FormStepEntity();
        else
            entity.setId(dto.getId());
        entity.setStepType(FormStepType.valueOf(dto.getFormStepType()));
        FormEntity form = formRepo.findById(dto.getFormId()).get();
        entity.setSeq(getNextSeq(form));
        entity.setForm(form);
        if(dto.getUser() !=null)
            entity.setUser(userRepository.findById(dto.getUser()).get());
        if(dto.getUsers()!=null){
            Set<UserEntity> users = new HashSet<>();
            entity.setUsers(users);
            for (Long userId : dto.getUsers()) {
                UserEntity userEntity = new UserEntity();
                userEntity.setId(userId);
                users.add(userEntity);
            }
        }
        if(dto.editFields !=null){
            entity.setEditFields(dto.editFields.stream().collect(Collectors.joining(",")));
        }
        if(dto.viewFields !=null){
            entity.setViewFields(dto.viewFields.stream().collect(Collectors.joining(",")));
        }
        return entity;
    }

    private static int getNextSeq(FormEntity form) {
        int maxSeq = 0;
        for (FormStepEntity step : form.getSteps()) {
            if(step.getSeq() !=null && step.getSeq() > maxSeq)
                maxSeq = step.getSeq();
        }
        return maxSeq + 1;
    }

    @Override
    protected List<FormStepEntity> filter(Map<String, String> filter) {
        if(filter!=null && filter.containsKey("formId")){
            String formId = filter.get("formId");
            FormStepEntity formStep = new FormStepEntity();
            FormEntity form = new FormEntity();
            form.setId(formId);
            formStep.setForm(form);
            Example<FormStepEntity> formStepExample = Example.of(formStep);
            List<FormStepEntity> all = getRepository().findAll(formStepExample, Sort.by(Sort.Order.asc("seq")));
            return all;
        }
        return super.filter(filter);
    }
}
