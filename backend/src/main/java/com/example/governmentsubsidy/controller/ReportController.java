package com.example.governmentsubsidy.controller;

import com.example.governmentsubsidy.service.ReportExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasAnyRole('ADMIN', 'FINANCE_OFFICER', 'DISTRICT_OFFICER')")
public class ReportController {

    private final ReportExportService reportExportService;

    public ReportController(ReportExportService reportExportService) {
        this.reportExportService = reportExportService;
    }

    @GetMapping("/schemes/csv")
    public ResponseEntity<byte[]> downloadSchemeReport() {
        byte[] data = reportExportService.generateSchemeSummaryCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=scheme_summary.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(data);
    }

    @GetMapping("/regions/csv")
    public ResponseEntity<byte[]> downloadRegionReport() {
        byte[] data = reportExportService.generateRegionalSummaryCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=region_summary.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(data);
    }

    @GetMapping("/disbursements/csv")
    public ResponseEntity<byte[]> downloadDisbursementReport() {
        byte[] data = reportExportService.generateDisbursementReportCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=disbursements.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(data);
    }

    @GetMapping("/milestones/csv")
    public ResponseEntity<byte[]> downloadPendingMilestonesReport() {
        byte[] data = reportExportService.generatePendingMilestonesCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=overdue_milestones.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(data);
    }

    @GetMapping("/utilizations/csv")
    public ResponseEntity<byte[]> downloadUtilizationReport() {
        byte[] data = reportExportService.generateUtilizationReportCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=utilizations.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(data);
    }
}
