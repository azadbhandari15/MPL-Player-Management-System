package com.mpl.backend.controller;

import com.mpl.backend.model.ImageUploadResult;
import com.mpl.backend.model.PlayerImportResult;
import com.mpl.backend.service.PlayerImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("mpl/admin/")
@RequiredArgsConstructor
public class PlayerImageUploadController {

    private final PlayerImportService service;

    @PostMapping(value = "/players/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PlayerImportResult upload(@RequestParam("file") MultipartFile file,
                                     @RequestParam(defaultValue = "true") boolean dryRun) throws IOException {
        return service.replaceAll(file, dryRun);
    }
}
