package com.svayambhu.backend.services;

import com.svayambhu.backend.models.AgentLog;
import com.svayambhu.backend.models.Workflow;
import com.svayambhu.backend.repositories.AgentLogRepository;
import com.svayambhu.backend.repositories.WorkflowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AiOrchestratorService {

    private final WorkflowRepository workflowRepository;
    private final AgentLogRepository agentLogRepository;

    public Workflow createWorkflow(String name) {
        Workflow wf = new Workflow();
        wf.setName(name);
        wf.setStatus("pending");
        wf.setCurrentAgent("Planner");
        return workflowRepository.save(wf);
    }

    public List<Workflow> getAllWorkflows() {
        return workflowRepository.findAll();
    }

    public Optional<Workflow> getWorkflow(String id) {
        return workflowRepository.findById(id);
    }

    public Workflow updateWorkflowStatus(String id, String status, String currentAgent) {
        return workflowRepository.findById(id).map(wf -> {
            wf.setStatus(status);
            wf.setCurrentAgent(currentAgent);
            if ("completed".equals(status) || "failed".equals(status)) {
                wf.setEndTime(java.time.LocalDateTime.now());
            }
            return workflowRepository.save(wf);
        }).orElseThrow(() -> new RuntimeException("Workflow not found"));
    }

    public void deleteWorkflow(String id) {
        workflowRepository.deleteById(id);
    }

    public AgentLog saveLog(AgentLog log) {
        return agentLogRepository.save(log);
    }

    public List<AgentLog> getRecentLogs() {
        return agentLogRepository.findTop100ByOrderByTimestampDesc();
    }

    @Transactional
    public void deleteAllLogs() {
        agentLogRepository.deleteAll();
    }
}


