package com.capstonebau2025.centralhub.service;
// GenericService.java

import org.springframework.stereotype.Service;

import java.util.Optional;

public interface GenericService <T, ID> {
    T create(T entity);
    T update(T entity);
    T save(T entity);  // Save will be a generic method that can be used for both create and update
    Optional<T> getById(ID id);
    Iterable<T> getAll();
    void deleteById(ID id);
    void delete(T entity);
}










