package com.example.governmentsubsidy.service;

import com.example.governmentsubsidy.dto.analytics.RegionAnalyticsDto;
import com.example.governmentsubsidy.dto.analytics.SchemeAnalyticsDto;
import com.example.governmentsubsidy.dto.milestone.MilestoneResponse;
import com.example.governmentsubsidy.entity.FundUtilization;
import com.example.governmentsubsidy.entity.SubsidyApplication;
import com.example.governmentsubsidy.enums.ApplicationStatus;
import com.example.governmentsubsidy.repository.FundUtilizationRepository;
import com.example.governmentsubsidy.repository.SubsidyApplicationRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ReportExportService {

    private final AnalyticsService analyticsService;
    private final MilestoneService milestoneService;
    private final SubsidyApplicationRepository applicationRepository;
    private final FundUtilizationRepository utilizationRepository;

    public ReportExportService(AnalyticsService analyticsService,
                               MilestoneService milestoneService,
                               SubsidyApplicationRepository applicationRepository,
                               FundUtilizationRepository utilizationRepository) {
        this.analyticsService = analyticsService;
        this.milestoneService = milestoneService;
        this.applicationRepository = applicationRepository;
        this.utilizationRepository = utilizationRepository;
    }

    public byte[] generateSchemeSummaryCsv() {
        List<SchemeAnalyticsDto> list = analyticsService.getSchemeAnalytics();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            writer.println("Scheme ID,Code,Title,Department,Total Budget,Remaining Budget,Approved Funds,Released Funds,Utilized Funds,Applications,Exhaustion %");
            for (SchemeAnalyticsDto s : list) {
                writer.printf("%d,\"%s\",\"%s\",\"%s\",%s,%s,%s,%s,%s,%d,%.2f%%%n",
                        s.getSchemeId(), s.getSchemeCode(), s.getSchemeTitle(), s.getDepartment(),
                        s.getTotalBudget(), s.getRemainingBudget(), s.getApprovedFunds(),
                        s.getReleasedFunds(), s.getUtilizedFunds(), s.getTotalApplications(),
                        s.getBudgetExhaustionPercentage());
            }
        }
        return out.toByteArray();
    }

    public byte[] generateRegionalSummaryCsv() {
        List<RegionAnalyticsDto> list = analyticsService.getRegionAnalytics();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            writer.println("Region ID,Code,State,District,Allocated Budget,Utilized Budget,Approved Funds,Released Funds,Applications,Utilization Rate %");
            for (RegionAnalyticsDto r : list) {
                writer.printf("%d,\"%s\",\"%s\",\"%s\",%s,%s,%s,%s,%d,%.2f%%%n",
                        r.getRegionId(), r.getRegionCode(), r.getStateName(), r.getDistrictName(),
                        r.getAllocatedBudget(), r.getUtilizedBudget(), r.getApprovedFunds(),
                        r.getReleasedFunds(), r.getTotalApplications(), r.getBudgetUtilizationRate());
            }
        }
        return out.toByteArray();
    }

    public byte[] generateDisbursementReportCsv() {
        List<SubsidyApplication> applications = applicationRepository.findAll();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            writer.println("Application No,Beneficiary,Identity No,Scheme,Region,Applied Amount,Approved Amount,Status,Risk Level,Score,Submission Date");
            for (SubsidyApplication a : applications) {
                writer.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%s,%s,\"%s\",\"%s\",%d,\"%s\"%n",
                        a.getApplicationNumber(),
                        a.getBeneficiary().getUser().getFullName(),
                        a.getBeneficiary().getIdentityNumber(),
                        a.getScheme().getTitle(),
                        a.getRegion().getDistrictName(),
                        a.getAppliedAmount(),
                        a.getApprovedAmount(),
                        a.getStatus(),
                        a.getRiskLevel(),
                        a.getEligibilityScore(),
                        a.getCreatedAt());
            }
        }
        return out.toByteArray();
    }

    public byte[] generatePendingMilestonesCsv() {
        List<MilestoneResponse> overdue = milestoneService.getOverdueMilestones();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            writer.println("Milestone ID,Plan ID,Sequence,Title,Type,Scheduled Amount,Due Date,Compliance Satisfied,Status");
            for (MilestoneResponse m : overdue) {
                writer.printf("%d,%d,%d,\"%s\",\"%s\",%s,\"%s\",%b,\"%s\"%n",
                        m.getId(), m.getPlanId(), m.getSequenceNumber(), m.getTitle(),
                        m.getMilestoneType(), m.getScheduledAmount(), m.getDueDate(),
                        m.isComplianceSatisfied(), m.getReleaseStatus());
            }
        }
        return out.toByteArray();
    }

    public byte[] generateUtilizationReportCsv() {
        List<FundUtilization> utilizations = utilizationRepository.findAll();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            writer.println("Utilization ID,Application No,Beneficiary,Utilized Amount,Status,Proof Document,Remarks,Submitted Date");
            for (FundUtilization u : utilizations) {
                writer.printf("%d,\"%s\",\"%s\",%s,\"%s\",\"%s\",\"%s\",\"%s\"%n",
                        u.getId(),
                        u.getApplication().getApplicationNumber(),
                        u.getApplication().getBeneficiary().getUser().getFullName(),
                        u.getUtilizedAmount(),
                        u.getVerificationStatus(),
                        u.getProofDocumentPath() != null ? u.getProofDocumentPath() : "N/A",
                        u.getRemarks() != null ? u.getRemarks().replace("\"", "'") : "",
                        u.getSubmittedAt());
            }
        }
        return out.toByteArray();
    }
}
