package ir.jaryan.form.cartable;

import ir.jaryan.base.Transferable;
import ir.jaryan.form.form.FormDTO;
import ir.jaryan.form.result.FormResultDTO;
import ir.jaryan.usermanagement.user.UserDTO;
import lombok.Data;

import java.util.Date;

@Data
public class CartableDTO implements Transferable<String> {
    String id;
    String title;
    String status;
    String step;
    Date assignDate;
    FormDTO form;
    UserDTO requestedBy;
    FormResultDTO result;
}
