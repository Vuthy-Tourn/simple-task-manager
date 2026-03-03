package com.vuthy.taskmanagerbackend.dto;

import com.vuthy.taskmanagerbackend.model.Task;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private Task.Priority priority = Task.Priority.MEDIUM;

    private Task.Status status;
}
