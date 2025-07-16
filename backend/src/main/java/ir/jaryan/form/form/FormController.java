package ir.jaryan.form.form;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import ir.jaryan.PageResponseUtil;
import ir.jaryan.base.BaseController;
import ir.jaryan.base.BaseRepository;
import ir.jaryan.form.formstep.FormStepDTO;
import ir.jaryan.form.formstep.FormStepEntity;
import ir.jaryan.usermanagement.role.RoleEntity;
import ir.jaryan.usermanagement.user.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/forms")
public class FormController extends BaseController<FormEntity, FormDTO, String> {
    @Autowired
    FormRepository formRepository;

    @Autowired
    ObjectMapper objectMapper;

    @GetMapping("create")
    public FormDTO create() {
        FormEntity formEntity = new FormEntity();
        formEntity.setName("فرم");
        HashMap<String, Object> defaultValues = getEmptyTemplate();
        try {
            String json = objectMapper.writeValueAsString(defaultValues);
            formEntity.setJson(json);
        }catch (Exception e){
            e.printStackTrace();
        }
        formRepository.save(formEntity);
        FormDTO formDTO = new FormDTO();
        formDTO.setId(formEntity.getId());
        formDTO.setName(formEntity.getName());
        formDTO.setText(formEntity.getJson());
        formDTO.setJson(defaultValues);
        return formDTO;
    }

    private static HashMap<String, Object> getEmptyTemplate() {
        HashMap<String, Object> template = new HashMap<>();
        template.put("pagePrevText", "قبلی");
        template.put("pageNextText", "بعدی");
        template.put("completeText", "اتمام");
        template.put("chooseText", "انتخاب فایل");
        template.put("fileChooseText", "انتخاب فایل");
        template.put("chooseFileCaption", "انتخاب فایل");
        template.put("chooseFileCaption", "انتخاب فایل");
        template.put("completedHtml", "<h3>فرم با موفقیت ثبت شد</h3>");
//        ArrayList<Map> elements = new ArrayList<>();
//        HashMap firstElement = new HashMap();
//        firstElement.put("type","paneldynamic");
//        firstElement.put("name","globalConditions");
//        firstElement.put("panelCount","1");
//        ArrayList<Map> templalteElements = new ArrayList<>();
//        HashMap firstTemplateElement = new HashMap();
//        firstTemplateElement.put("expression", "conditionExpression");
//        firstTemplateElement.put("text", "autocompleteValue");
//        templalteElements.add(firstTemplateElement);
//        firstElement.put("templateElements", templalteElements);
//        elements.add(firstElement);
//        template.put("elements", elements);
        return template;
    }

    @GetMapping("/forms")
    public ResponseEntity<List<FormDTO>> list() {
        List<FormEntity> list = formRepository.findAll();
        List<FormDTO> result = new ArrayList<>();
        for (FormEntity formEntity : list) {
            result.add(toDto(formEntity));
        }
        return PageResponseUtil.convert(result);
    }
    @GetMapping("getSurvey")
    public ResponseEntity<FormDTO> getSurvey(@RequestParam String surveyId) {
        Optional<FormEntity> loadOptional = formRepository.findById(surveyId);
        if (loadOptional.isPresent()) {
            FormEntity entity = loadOptional.get();
            FormDTO dto = toDto(entity);
            return ResponseEntity.ok(dto);
        }else{
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("my/{id}")
    public FormDTO getFilteredForm(@PathVariable("id") String id) {
        FormDTO formDTO = super.getById(id);
        FormUtils.filterFormElements(formDTO.getJson(), formDTO.getViewFields(), formDTO.getEditFields());
        return formDTO;

    }

    @Override
    public FormDTO getById(String id) {
        if("0".equals(id)){
            FormEntity formEntity = new FormEntity();
            formEntity.setName("فرم");
            HashMap<String, Object> defaultValues = getEmptyTemplate();
            try {
                String json = objectMapper.writeValueAsString(defaultValues);
                formEntity.setJson(json);
            }catch (Exception e){
                e.printStackTrace();
            }
            formRepository.save(formEntity);
            FormDTO formDTO = new FormDTO();
            formDTO.setId(formEntity.getId());
            formDTO.setName(formEntity.getName());
            formDTO.setText(formEntity.getJson());
            formDTO.setJson(defaultValues);
            return formDTO;
        }else {
            FormDTO formDTO = super.getById(id);

//            FormUtils.filterFormElements(formDTO.getJson(), formDTO.getViewFields(), formDTO.getEditFields());
            return formDTO;
        }
    }

    @Override
    public FormDTO toDto(FormEntity entity) {
        FormDTO dto = new FormDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        if(entity.getEditFields() !=null)
            dto.setEditFields(Arrays.asList(entity.getEditFields().split(",")));
        if(entity.getViewFields() !=null)
            dto.setViewFields(Arrays.asList(entity.getViewFields().split(",")));
        try {
            if(StringUtils.hasText(entity.getJson())) {
                Map<String, Object> map = objectMapper.readValue(entity.getJson(), new TypeReference<Map<String, Object>>() {});
                dto.setName((String) map.get("title"));
                dto.setJson(map);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        dto.setSteps(new ArrayList<>());
        if(entity.getSteps()!=null){
            for (FormStepEntity step : entity.getSteps()) {
                FormStepDTO formStepDTO = new FormStepDTO();
                formStepDTO.setUsers(new ArrayList());
                if(step.getUsers()!=null){
                    step.getUsers().forEach(userEntity -> {
                        formStepDTO.getUsers().add(userEntity.getId());
                    });
                }
                dto.getSteps().add(formStepDTO);
            }
        }
        if(entity.getRoles()!=null){
            dto.setRoles(entity.getRoles().stream().map(r -> r.getId()).collect(Collectors.toList()));
        }
        if(entity.getUsers()!=null){
            dto.setUsers(entity.getUsers().stream().map(r -> r.getId()).collect(Collectors.toList()));
        }
        return dto;
    }

    @Override
    public FormEntity toEntity(FormDTO dto, FormEntity entity) {
        if(Boolean.TRUE.equals(dto.getDesigner())) {
            try {
                List<Map> pages = (List<Map>) dto.getJson().get("pages");
                if(pages!=null){
                    for (Map page : pages) {
                        List<Map> elements = (List<Map>) page.get("elements");
                        if(elements!= null){
                            for (Map element : elements) {
                                if(element.get("type").equals("question-type-form")){
                                    String form = (String) element.get("form");
                                    String field = (String) element.get("field");
                                    if(form != null && field != null){
                                        Map map = (Map) element.get("choicesByUrl");
                                        if(map == null) {
                                            map = new HashMap<>();
                                            element.put("choicesByUrl", map);
                                        }
                                        map.put("url", "http://sample.com/results/" + form + "/" + field);

                                    }
                                }
                            }
                        }
                    }
                }
                String json = objectMapper.writeValueAsString(dto.getJson());
                entity.setJson(json);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }else {
            if (dto.editFields != null) {
                entity.setEditFields(dto.editFields.stream().collect(Collectors.joining(",")));
            }
            if (dto.viewFields != null) {
                entity.setViewFields(dto.viewFields.stream().collect(Collectors.joining(",")));
            }
            if (entity.getSteps() == null)
                entity.setSteps(new ArrayList<>());
            else
                entity.getSteps().clear();
            for (FormStepDTO step : dto.getSteps()) {
                FormStepEntity stepEntity = new FormStepEntity();
                stepEntity.setForm(entity);
                stepEntity.setUsers(new HashSet<>());
                if (step.getUsers() != null) {
                    for (Long user : step.getUsers()) {
                        UserEntity userEntity = new UserEntity();
                        userEntity.setId(user);
                        stepEntity.getUsers().add(userEntity);
                    }
                }
                entity.getSteps().add(stepEntity);
            }
            if (dto.getRoles() != null) {
                if (entity.getRoles() != null)
                    entity.getRoles().clear();
                else
                    entity.setRoles(new HashSet<>());
                for (Long roleId : dto.getRoles()) {
                    RoleEntity roleEntity = new RoleEntity();
                    roleEntity.setId(roleId);
                    entity.getRoles().add(roleEntity);
                }
            }
            if (dto.getUsers() != null) {
                if (entity.getUsers() != null)
                    entity.getUsers().clear();
                else
                    entity.setUsers(new HashSet<>());
                for (Long userId : dto.getUsers()) {
                    UserEntity userEntity = new UserEntity();
                    userEntity.setId(userId);
                    entity.getUsers().add(userEntity);
                }
            }
        }
        return entity;
    }

    @GetMapping("delete")
    public ResponseEntity<Void> delete(@RequestParam("id") String surveyId) {
        return formRepository.findById(surveyId).map(entity -> {
            formRepository.delete(entity);
            return ResponseEntity.ok().<Void>build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("changeJson")
    public ResponseEntity<FormDTO> update(@RequestBody FormDTO dto){
        Optional<FormEntity> loadOptional = formRepository.findById(dto.getId());
        if (loadOptional.isPresent()) {
            FormEntity entity = loadOptional.get();
            entity.setName(dto.getName());
            try {
                String json = objectMapper.writeValueAsString(dto.getJson());
                entity.setJson(json);
                formRepository.save(entity);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
            return ResponseEntity.ok(dto);
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public BaseRepository<FormEntity, String> getRepository() {
        return formRepository;
    }
}
