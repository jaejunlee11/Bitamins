package com.saessakmaeul.bitamin.exercise.service;

import com.saessakmaeul.bitamin.exercise.dto.responseDto.ExcersizeDetailResponse;
import com.saessakmaeul.bitamin.exercise.entity.Excersize;
import com.saessakmaeul.bitamin.exercise.repository.ExcersizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExcersizeService {
    @Autowired
    private ExcersizeRepository excersizeRepository;

    public ExcersizeDetailResponse getExcersize(long id) throws Exception{
        Excersize excersize = excersizeRepository.findById(id).orElseThrow(()->new Exception("해당 id의 운동이 존재하지 않습니다."));
        ExcersizeDetailResponse result = ExcersizeDetailResponse.builder()
                .id(excersize.getId())
                .title(excersize.getTitle())
                .description(excersize.getDescription())
                .level(excersize.getLevel())
                .exerciseUrl(excersize.getExerciseUrl())
                .build();
        return result;
    }
}
