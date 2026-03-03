package com.vuthy.taskmanagerbackend.service;

import com.vuthy.taskmanagerbackend.dto.TaskRequest;
import com.vuthy.taskmanagerbackend.dto.TaskResponse;
import com.vuthy.taskmanagerbackend.model.Task;
import com.vuthy.taskmanagerbackend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository repo;

    public List<TaskResponse> getAll() {
        return repo.findAllByOrderByCreatedAtDesc()
                   .stream().map(TaskResponse::from).toList();
    }

    public TaskResponse getById(Long id) {
        return TaskResponse.from(findOrThrow(id));
    }

    public TaskResponse create(TaskRequest req) {
        Task task = Task.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .priority(req.getPriority() != null ? req.getPriority() : Task.Priority.MEDIUM)
                .status(Task.Status.TODO)
                .build();
        return TaskResponse.from(repo.save(task));
    }

    public TaskResponse update(Long id, TaskRequest req) {
        Task task = findOrThrow(id);
        if (req.getTitle()       != null) task.setTitle(req.getTitle());
        if (req.getDescription() != null) task.setDescription(req.getDescription());
        if (req.getPriority()    != null) task.setPriority(req.getPriority());
        if (req.getStatus()      != null) task.setStatus(req.getStatus());
        return TaskResponse.from(repo.save(task));
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NoSuchElementException("Task not found: " + id);
        repo.deleteById(id);
    }

    private Task findOrThrow(Long id) {
        return repo.findById(id)
                   .orElseThrow(() -> new NoSuchElementException("Task not found: " + id));
    }
}
