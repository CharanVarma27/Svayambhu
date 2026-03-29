package com.svayambhu.backend.controllers;

import com.svayambhu.backend.models.AgentLog;
import com.svayambhu.backend.models.Workflow;
import com.svayambhu.backend.services.AiOrchestratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class WorkflowController {

    private final AiOrchestratorService orchestratorService;

    @PostMapping("/workflows")
    public ResponseEntity<Workflow> createWorkflow(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(orchestratorService.createWorkflow(request.get("name")));
    }

    @GetMapping("/workflows")
    public ResponseEntity<List<Workflow>> getWorkflows() {
        return ResponseEntity.ok(orchestratorService.getAllWorkflows());
    }

    @GetMapping("/workflows/{id}")
    public ResponseEntity<Workflow> getWorkflow(@PathVariable String id) {
        return orchestratorService.getWorkflow(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/workflows/{id}/status")
    public ResponseEntity<Workflow> updateStatus(@PathVariable String id, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(orchestratorService.updateWorkflowStatus(
                id,
                request.get("status"),
                request.get("currentAgent")));
    }

    @DeleteMapping("/workflows/{id}")
    public ResponseEntity<Void> deleteWorkflow(@PathVariable String id) {
        orchestratorService.deleteWorkflow(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/logs")
    public ResponseEntity<AgentLog> addLog(@RequestBody AgentLog log) {
        return ResponseEntity.ok(orchestratorService.saveLog(log));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<AgentLog>> getLogs() {
        return ResponseEntity.ok(orchestratorService.getRecentLogs());
    }

    @DeleteMapping("/logs")
    public ResponseEntity<Void> deleteAllLogs() {
        orchestratorService.deleteAllLogs();
        return ResponseEntity.noContent().build();
    }
}

