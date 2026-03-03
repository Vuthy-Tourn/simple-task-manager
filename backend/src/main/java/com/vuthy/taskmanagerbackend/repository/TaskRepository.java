package com.vuthy.taskmanagerbackend.repository;

import com.vuthy.taskmanagerbackend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByOrderByCreatedAtDesc();
    List<Task> findByStatus(Task.Status status);
}
