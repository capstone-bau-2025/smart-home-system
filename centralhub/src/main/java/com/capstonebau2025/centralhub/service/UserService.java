package com.capstonebau2025.centralhub.service;

// UserService.java

import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService extends GenericServiceImpl<User, Long> {

    @Autowired
    public UserService(UserRepository userRepository) {
        setRepository(userRepository);
    }

    public User create(User user) {
        return super.create(user);
    }

    public User update(User user) {
        return super.update(user);
    }

    public Optional<User> getById(Long id) {
        return super.getById(id);
    }

    public Iterable<User> getAll() {
        return super.getAll();
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public void delete(User user) {
        super.delete(user);
    }
}