package com.example.backend.DTO;

import lombok.Getter;

import java.util.List;

@Getter
public class ListDTO {
    int count;
    List<?> data;
    public ListDTO(List<?> list){
        this.data=list;
        this.count=list.size();
    }
}
