package ir.jaryan.form.cartable;

import ir.jaryan.form.darkhast.DarkhastEntity;
import ir.jaryan.form.darkhast.DarkhastRepository;
import ir.jaryan.form.form.FormEntity;
import ir.jaryan.form.formstep.FormStepEntity;
import ir.jaryan.form.formstep.FormStepType;
import ir.jaryan.form.result.FormResultEntity;
import ir.jaryan.usermanagement.user.UserEntity;
import ir.jaryan.usermanagement.user.UserRepository;
import ir.jaryan.usermanagement.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.Optional;

@Service
public class CartableService {
    @Autowired
    CartableRepository cartableRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    DarkhastRepository darkhastRepository;

    public void addToCartable(String cartableId, FormResultEntity formResult, FormEntity form) {
        FormStepEntity currentStep = null;
        DarkhastEntity darkhast;
        if(cartableId ==null) {
            darkhast = new DarkhastEntity();
            darkhast.setStartDate(new Date());
            darkhast.setRequestedBy(userService.getCurrentUserEntity());
            darkhastRepository.save(darkhast);
        }else{
            Optional<CartableEntity> cartableOptional = cartableRepository.findById(cartableId);
            CartableEntity cartableEntity = cartableOptional.get();
            cartableEntity.setStatus(CartableStatus.APPROVED);
            currentStep = cartableEntity.getStep();
            cartableRepository.save(cartableEntity);
            darkhast = cartableEntity.getDarkhast();
        }
        if(!CollectionUtils.isEmpty(form.getSteps())){
            int nextStepIndex = getNextStepIndex(form, currentStep);
            if(nextStepIndex < form.getSteps().size()){
                FormStepEntity formStepEntity = form.getSteps().get(nextStepIndex);
                CartableEntity newCartable = new CartableEntity();
                newCartable.setDarkhast(darkhast);
                newCartable.setStep(formStepEntity);
                newCartable.setFormResult(formResult);
                newCartable.setForm(form);
                newCartable.setTitle(form.getName());
                newCartable.setStatus(CartableStatus.PENDING);
                UserEntity currentUser = userService.getCurrentUserEntity();
                newCartable.setRequestedBy(currentUser);
                if(FormStepType.BOSS.equals(formStepEntity.getStepType())){
                    newCartable.setAssignee(currentUser.getBoss());
                }
                if(FormStepType.USER.equals(formStepEntity.getStepType())) {
                    newCartable.setAssignee(formStepEntity.getUser());
//                    if(formStepEntity.getUsers()!=null && formStepEntity.getUsers().size()>0) {
//                        newCartable.setAssignee((UserEntity) new ArrayList(formStepEntity.getUsers()).get(0));
//                    }
                }
                if(FormStepType.BACK_TO_START.equals(formStepEntity.getStepType())){
                    newCartable.setAssignee(darkhast.getRequestedBy());
                }
// TODO
//                if(FormStepType.BACK_TO_PREV.equals(formStepEntity.getStepType())){
//                    newCartable.setAssignee(currentUser.getBoss());
//                }
                cartableRepository.save(newCartable);
            }else{
                darkhast.setEndDate(new Date());
                darkhastRepository.save(darkhast);
            }
        }
    }

    private static int getNextStepIndex(FormEntity form, FormStepEntity currentStep) {
        int nextStepIndex = 0;
        if(currentStep != null) {
            for (int index = 0; index < form.getSteps().size(); index++) {
                FormStepEntity formStepEntity = form.getSteps().get(index);
                if (formStepEntity.getId().equals(currentStep.getId())) {
                    // if confirm go to next, else?
                    nextStepIndex = index + 1;
                }
            }
        }
        return nextStepIndex;
    }

}
