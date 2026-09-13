package com.example.governmentsubsidy.scheduler;

import com.example.governmentsubsidy.entity.DisbursementMilestone;
import com.example.governmentsubsidy.entity.SubsidyApplication;
import com.example.governmentsubsidy.enums.ApplicationStatus;
import com.example.governmentsubsidy.enums.MilestoneReleaseStatus;
import com.example.governmentsubsidy.repository.DisbursementMilestoneRepository;
import com.example.governmentsubsidy.repository.FundUtilizationRepository;
import com.example.governmentsubsidy.repository.SubsidyApplicationRepository;
import com.example.governmentsubsidy.service.AuditLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@ConditionalOnProperty(name = "app.scheduling.enabled", havingValue = "true", matchIfMissing = true)
public class ComplianceMonitoringScheduler {

    private static final Logger log = LoggerFactory.getLogger(ComplianceMonitoringScheduler.class);

    private final DisbursementMilestoneRepository milestoneRepository;
    private final SubsidyApplicationRepository applicationRepository;
    private final FundUtilizationRepository utilizationRepository;
    private final AuditLogService auditLogService;

    public ComplianceMonitoringScheduler(DisbursementMilestoneRepository milestoneRepository,
                                         SubsidyApplicationRepository applicationRepository,
                                         FundUtilizationRepository utilizationRepository,
                                         AuditLogService auditLogService) {
        this.milestoneRepository = milestoneRepository;
        this.applicationRepository = applicationRepository;
        this.utilizationRepository = utilizationRepository;
        this.auditLogService = auditLogService;
    }

    @Scheduled(cron = "${app.scheduler.milestone-check:0 0 * * * ?}")
    @Transactional
    public void checkOverdueMilestones() {
        log.info("Running Compliance Monitoring Job: Checking overdue milestones...");
        LocalDate today = LocalDate.now();
        List<DisbursementMilestone> overdueList = milestoneRepository.findOverdueMilestones(today);

        for (DisbursementMilestone m : overdueList) {
            log.warn("Flagging OVERDUE Milestone: ID={}, Title={}, DueDate={}", m.getId(), m.getTitle(), m.getDueDate());
            m.setReleaseStatus(MilestoneReleaseStatus.OVERDUE);
            milestoneRepository.save(m);

            auditLogService.logAction(
                    "COMPLIANCE_SCHEDULER",
                    "MILESTONE_FLAGGED_OVERDUE",
                    "DisbursementMilestone",
                    m.getId().toString(),
                    MilestoneReleaseStatus.PENDING.name(),
                    MilestoneReleaseStatus.OVERDUE.name(),
                    "Milestone past due date (" + m.getDueDate() + ") with pending compliance"
            );
        }
        log.info("Compliance Monitoring Job finished. Overdue milestones flagged: {}", overdueList.size());
    }

    @Scheduled(cron = "${app.scheduler.utilization-check:0 30 * * * ?}")
    @Transactional(readOnly = true)
    public void monitorUtilizationSubmissions() {
        log.info("Running Utilization Compliance Monitor...");
        List<SubsidyApplication> fullyDisbursed = applicationRepository.findByStatus(ApplicationStatus.FULLY_DISBURSED);

        for (SubsidyApplication app : fullyDisbursed) {
            long utilizationCount = utilizationRepository.findByApplicationId(app.getId()).size();
            if (utilizationCount == 0 && app.getUpdatedAt().isBefore(LocalDateTime.now().minusDays(60))) {
                log.warn("Application {} has been fully disbursed for > 60 days with zero utilization submitted", app.getApplicationNumber());
                auditLogService.logAction(
                        "COMPLIANCE_SCHEDULER",
                        "UTILIZATION_NON_COMPLIANCE_ALERT",
                        "SubsidyApplication",
                        app.getId().toString(),
                        app.getStatus().name(),
                        app.getStatus().name(),
                        "Beneficiary has not submitted utilization report for over 60 days after full disbursement"
                );
            }
        }
    }
}
