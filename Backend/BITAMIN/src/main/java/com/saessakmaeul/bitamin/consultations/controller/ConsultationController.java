package com.saessakmaeul.bitamin.consultations.controller;

import com.saessakmaeul.bitamin.consultations.Entity.Consultation;
import com.saessakmaeul.bitamin.consultations.Entity.SerchCondition;
import com.saessakmaeul.bitamin.consultations.dto.request.SelectAllResquest;
import com.saessakmaeul.bitamin.consultations.dto.response.SelectAllResponse;
import com.saessakmaeul.bitamin.consultations.service.ConsultationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consultations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ConsultationController {
    private final ConsultationService consultationService;

    @GetMapping
    public ResponseEntity<?> selectAll(
//            @RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                       @RequestParam(value = "page", defaultValue = "0") int page,
                                       @RequestParam(value = "size", defaultValue = "100") int size,
                                       @RequestParam(value = "type") SerchCondition type) {

        System.out.println("Controller");

        List<SelectAllResponse> consultations = consultationService.selectAll(page, size, type);

        return ResponseEntity.ok(consultations);
    }
}
