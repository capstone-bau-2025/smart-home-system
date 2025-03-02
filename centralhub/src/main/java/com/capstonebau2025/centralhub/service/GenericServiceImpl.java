package com.capstonebau2025.centralhub.service;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public class GenericServiceImpl<T, ID> implements GenericService<T, ID> {

    protected JpaRepository<T, ID> repository;

    public void setRepository(JpaRepository<T, ID> repository) {
        this.repository = repository;
    }

    @Override
    public T create(T entity) {
        return repository.save(entity);
    }

    @Override
    public T update(T entity) {
        return repository.save(entity);
    }

    @Override
    public T save(T entity) {
        return repository.save(entity);
    }

    @Override
    public Optional<T> getById(ID id) {
        return repository.findById(id);
    }

    @Override
    public Iterable<T> getAll() {
        return repository.findAll();
    }

    @Override
    public void deleteById(ID id) {
        repository.deleteById(id);
    }

    @Override
    public void delete(T entity) {
        repository.delete(entity);
    }
}
