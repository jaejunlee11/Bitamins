package com.saessakmaeul.bitamin.exercise.controller;

import com.saessakmaeul.bitamin.exercise.dto.responseDto.ExcersizeDetailResponse;
import com.saessakmaeul.bitamin.exercise.entity.Excersize;
import com.saessakmaeul.bitamin.exercise.service.ExcersizeService;
import com.saessakmaeul.bitamin.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/exercises")
public class ExcerciseController {
    @Autowired
    private ExcersizeService excersizeService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/{id}")
    public ResponseEntity<?> getExcersize(@PathVariable long id, @RequestHeader String token) {
        try{
            if(jwtUtil.isTokenExpired(token.substring(7))) throw new Exception("유저가 유효하지 않습니다.");
            ExcersizeDetailResponse response = excersizeService.getExcersize(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
