package com.saessakmaeul.bitamin.util.file.controller;

import org.springframework.core.io.UrlResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.util.UUID;

@RestController
@RequestMapping("/file")
public class FileController {
    // 이미지 저장 주소
    private static final String UPLOAD_DIR = "resources/img/";

    // 사용하는 url은 아님 참고용
    /*
        프론트는 이런식으로 넣기
        <form action="/item" method="post" enctype="multipart/form-data">
         <ul>
            <li>상품명 <input type="text" name="itemName"></li>
            <li>첨부파일 <input type="file" name="attachFile"></li>
            <li>이미지 파일들 <input type="file" multiple="multiple" name="imageFiles"></li>
         </ul>
         <input type="submit"/>
         </form>
     */
    @PostMapping("/upload")
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) {
        try {
            // 디렉토리가 존재하지 않으면 생성
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // 파일 이름 중복 방지를 위해 UUID 사용
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, fileName);
            file.transferTo(filePath);

            return ResponseEntity.ok(fileName);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // 이미지 불러오기
    @GetMapping("/{fileName}")
    public ResponseEntity<Resource> showImage(@PathVariable(name = "fileName") String fileName) {
        System.out.println(fileName);
        try {
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Resource resource = new UrlResource(filePath.toUri());


            if (resource.exists()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                filePath = Paths.get(UPLOAD_DIR + "noImage.jpg");
                String contentType = Files.probeContentType(filePath);
                resource = new UrlResource(filePath.toUri());
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            }
        } catch (Exception exception) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
