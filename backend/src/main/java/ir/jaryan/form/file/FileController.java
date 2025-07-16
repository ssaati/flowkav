package ir.jaryan.form.file;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("surveys/api")
public class FileController {

    @Autowired
    FileService fileService;

    @Autowired
    FileRepository fileRepository;

    @PostMapping("/upload")
    public List<Map<String, String>> uploadFiles(@RequestParam("files") MultipartFile[] files, @RequestParam("surveyId") String surveyId) {
        List<Map<String, String>> responseList = new ArrayList<>();

        for (MultipartFile file : files) {
            Map<String, String> response = new HashMap<>();
            try {
                File uploadPath = new File("uploads/");
                if (!uploadPath.exists()) uploadPath.mkdirs();

                UploadedFile savedFile = fileService.saveFile(file);
                response.put("name", file.getOriginalFilename());
                response.put("url", "/files/download/" + savedFile.getId()); // Unique URL per file

                response.put("fileId", savedFile.getId());
                response.put("fileName", savedFile.getFileName());
                responseList.add(response);

            } catch (IOException e) {
                response.put("error", "File upload failed");
            }
        }

        return responseList;
    }
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable String id) {
        Optional<UploadedFile> fileOptional = fileRepository.findById(id);
        if (fileOptional.isPresent()) {
            UploadedFile file = fileOptional.get();
            return ResponseEntity.ok()
                    .header("Content-Type", file.getFileType())
                    .header("Content-Disposition", "attachment; filename=" + file.getFileName())
                    .body(file.getFileData());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable String id) {
        Optional<UploadedFile> fileOptional = fileRepository.findById(id);
        if (fileOptional.isPresent()) {
            fileRepository.delete(fileOptional.get());
            return ResponseEntity.ok().body("File deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFiles(@RequestBody List<String> fileIds) {
        for (String fileId : fileIds) {
            Optional<UploadedFile> fileOptional = fileRepository.findById(fileId);
            fileOptional.ifPresent(fileRepository::delete);
        }
        return ResponseEntity.ok().body("Files deleted successfully");
    }
}