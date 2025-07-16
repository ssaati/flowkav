package ir.jaryan;

import ir.jaryan.PageResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public class PageResponseUtil {
    public static ResponseEntity convert(List data) {
        PageResponse page = new PageResponse<>();
        page.setData(data);
        page.setTotal(10L);
        return ResponseEntity.ok()
                .header("Content-Range", "data " + 0 + "-" + 10 + "/" + 10)
                .body(data);

    }
}
