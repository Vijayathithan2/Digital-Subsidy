package com.example.governmentsubsidy.service;

import com.example.governmentsubsidy.dto.milestone.MilestoneResponse;
import com.example.governmentsubsidy.entity.DisbursementMilestone;
import com.example.governmentsubsidy.enums.MilestoneReleaseStatus;
import com.example.governmentsubsidy.exception.ResourceNotFoundException;
import com.example.governmentsubsidy.repository.DisbursementMilestoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MilestoneService {

    private final DisbursementMilestoneRepository milestoneRepository;
    private final AuditLogService auditLogService;

    public MilestoneService(DisbursementMilestoneRepository milestoneRepository,
                            AuditLogService auditLogService) {
        this.milestoneRepository = milestoneRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public MilestoneResponse markComplianceSatisfied(Long milestoneId, String remarks, String actingUser) {
        DisbursementMilestone milestone = getMilestoneEntity(milestoneId);

        if (milestone.getReleaseStatus() == MilestoneReleaseStatus.RELEASED) {
            throw new IllegalStateException("Milestone has already been released");
        }

        milestone.setComplianceSatisfied(true);
        milestone.setReleaseStatus(MilestoneReleaseStatus.ELIGIBLE_FOR_RELEASE);
        DisbursementMilestone saved = milestoneRepository.save(milestone);

        auditLogService.logAction(
                actingUser,
                "MILESTONE_COMPLIANCE_SATISFIED",
                "DisbursementMilestone",
                saved.getId().toString(),
                MilestoneReleaseStatus.PENDING.name(),
                MilestoneReleaseStatus.ELIGIBLE_FOR_RELEASE.name(),
                "Milestone " + saved.getTitle() + " marked compliance satisfied. Remarks: " + remarks
        );

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public DisbursementMilestone getMilestoneEntity(Long id) {
        return milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disbursement milestone not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public MilestoneResponse getMilestoneById(Long id) {
        return mapToResponse(getMilestoneEntity(id));
    }

    @Transactional(readOnly = true)
    public List<MilestoneResponse> getMilestonesByApplication(Long applicationId) {
        return milestoneRepository.findByPlanApplicationIdOrderBySequenceNumberAsc(applicationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MilestoneResponse> getOverdueMilestones() {
        return milestoneRepository.findOverdueMilestones(LocalDate.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public MilestoneResponse mapToResponse(DisbursementMilestone m) {
        MilestoneResponse res = new MilestoneResponse();
        res.setId(m.getId());
        res.setPlanId(m.getPlan().getId());
        res.setSequenceNumber(m.getSequenceNumber());
        res.setTitle(m.getTitle());
        res.setMilestoneType(m.getMilestoneType());
        res.setScheduledAmount(m.getScheduledAmount());
        res.setDueDate(m.getDueDate());
        res.setComplianceCondition(m.getComplianceCondition());
        res.setComplianceSatisfied(m.isComplianceSatisfied());
        res.setReleaseStatus(m.getReleaseStatus());
        res.setCompletedAt(m.getCompletedAt());

        if (m.getFundRelease() != null) {
            res.setTransactionRefNumber(m.getFundRelease().getTransactionRefNumber());
            res.setReleasedAmount(m.getFundRelease().getReleasedAmount());
            res.setReleasedAt(m.getFundRelease().getReleasedAt());
        }

        return res;
    }
}
