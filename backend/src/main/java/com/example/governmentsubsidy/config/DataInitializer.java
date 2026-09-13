package com.example.governmentsubsidy.config;

import com.example.governmentsubsidy.entity.*;
import com.example.governmentsubsidy.enums.*;
import com.example.governmentsubsidy.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final RegionRepository regionRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final SchemeRepository schemeRepository;
    private final SubsidyApplicationRepository applicationRepository;
    private final DisbursementPlanRepository planRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           RegionRepository regionRepository,
                           BeneficiaryRepository beneficiaryRepository,
                           SchemeRepository schemeRepository,
                           SubsidyApplicationRepository applicationRepository,
                           DisbursementPlanRepository planRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.regionRepository = regionRepository;
        this.beneficiaryRepository = beneficiaryRepository;
        this.schemeRepository = schemeRepository;
        this.applicationRepository = applicationRepository;
        this.planRepository = planRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() > 0) {
            log.info("Database already initialized with seed data.");
            return;
        }

        log.info("Initializing Government Subsidy System seed data...");

        // 1. Roles
        Role rBeneficiary = roleRepository.save(new Role(RoleType.ROLE_BENEFICIARY));
        Role rFieldOfficer = roleRepository.save(new Role(RoleType.ROLE_FIELD_OFFICER));
        Role rDistrictOfficer = roleRepository.save(new Role(RoleType.ROLE_DISTRICT_OFFICER));
        Role rFinanceOfficer = roleRepository.save(new Role(RoleType.ROLE_FINANCE_OFFICER));
        Role rAdmin = roleRepository.save(new Role(RoleType.ROLE_ADMIN));

        // 2. Users
        User admin = createUser("admin", "Admin@123", "Rajesh Sharma (Admin)", "admin@gov.in", "+91 9876543210", Set.of(rAdmin));
        User fieldOfficer = createUser("field_officer1", "Officer@123", "Amit Kumar (Field Officer)", "amit.field@gov.in", "+91 9876543211", Set.of(rFieldOfficer));
        User districtOfficer = createUser("district_officer1", "District@123", "Dr. Neha Verma (District Magistrate)", "neha.district@gov.in", "+91 9876543212", Set.of(rDistrictOfficer));
        User financeOfficer = createUser("finance_officer1", "Finance@123", "Sanjay Gupta (Finance Officer)", "sanjay.finance@gov.in", "+91 9876543213", Set.of(rFinanceOfficer));
        User beneficiaryUser1 = createUser("farmer_john", "User@123", "John Doe (Farmer)", "john.farmer@email.com", "+91 9876543214", Set.of(rBeneficiary));
        User beneficiaryUser2 = createUser("artisan_priya", "User@123", "Priya Patel (Handicrafts)", "priya.artisan@email.com", "+91 9876543215", Set.of(rBeneficiary));

        // 3. Regions
        Region rDelhi = regionRepository.save(new Region("REG-DL-01", "Delhi", "New Delhi", "Chanakyapuri", new BigDecimal("50000000.00")));
        Region rPune = regionRepository.save(new Region("REG-MH-01", "Maharashtra", "Pune", "Haveli", new BigDecimal("100000000.00")));
        Region rBangalore = regionRepository.save(new Region("REG-KA-01", "Karnataka", "Bengaluru Rural", "Devanahalli", new BigDecimal("80000000.00")));

        // 4. Beneficiaries
        Beneficiary b1 = new Beneficiary();
        b1.setUser(beneficiaryUser1);
        b1.setRegion(rPune);
        b1.setIdentityNumber("AADHAAR-8839-2091-1123");
        b1.setCategory(BeneficiaryCategory.OBC);
        b1.setDateOfBirth(LocalDate.of(1985, 4, 15));
        b1.setAnnualIncome(new BigDecimal("150000.00"));
        b1.setLandHoldingHectares(new BigDecimal("1.80"));
        b1.setDisabled(false);
        b1.setBankAccountNumber("309811223344");
        b1.setBankIfscCode("SBIN0001234");
        b1.setBankName("State Bank of India");
        b1.setAddressLine("Village Wadgaon, Taluk Haveli, District Pune");
        b1.setKycStatus(KycStatus.VERIFIED);
        beneficiaryRepository.save(b1);

        Beneficiary b2 = new Beneficiary();
        b2.setUser(beneficiaryUser2);
        b2.setRegion(rBangalore);
        b2.setIdentityNumber("AADHAAR-5512-3902-8844");
        b2.setCategory(BeneficiaryCategory.EWS);
        b2.setDateOfBirth(LocalDate.of(1992, 8, 20));
        b2.setAnnualIncome(new BigDecimal("95000.00"));
        b2.setLandHoldingHectares(new BigDecimal("0.00"));
        b2.setDisabled(false);
        b2.setBankAccountNumber("601244556677");
        b2.setBankIfscCode("PUNB0123400");
        b2.setBankName("Punjab National Bank");
        b2.setAddressLine("Handloom Colony, Devanahalli, Bengaluru Rural");
        b2.setKycStatus(KycStatus.VERIFIED);
        beneficiaryRepository.save(b2);

        // 5. Schemes
        Scheme sAgri = new Scheme();
        sAgri.setCode("SCH-AGRI-01");
        sAgri.setTitle("Pradhan Mantri Krishi Vikas Subsidy");
        sAgri.setDescription("Financial assistance and modern equipment subsidy for marginal and small farmers.");
        sAgri.setDepartment("Department of Agriculture & Farmers Welfare");
        sAgri.setTotalBudget(new BigDecimal("50000000.00"));
        sAgri.setRemainingBudget(new BigDecimal("50000000.00"));
        sAgri.setMinGrantAmount(new BigDecimal("20000.00"));
        sAgri.setMaxGrantAmount(new BigDecimal("150000.00"));
        sAgri.setMinEligibilityScore(60);
        sAgri.setActive(true);

        sAgri.addCriterion(new EligibilityCriterion(sAgri, CriterionType.ANNUAL_INCOME, ComparisonOperator.LESS_THAN_OR_EQUAL, "300000", 35, true, "Annual household income must be <= 300,000 INR"));
        sAgri.addCriterion(new EligibilityCriterion(sAgri, CriterionType.LAND_HOLDING, ComparisonOperator.LESS_THAN_OR_EQUAL, "2.5", 35, true, "Land holding must not exceed 2.5 hectares"));
        sAgri.addCriterion(new EligibilityCriterion(sAgri, CriterionType.BENEFICIARY_CATEGORY, ComparisonOperator.IN, "OBC,SC,ST,EWS", 30, false, "Priority affirmative categories award 30 points"));
        schemeRepository.save(sAgri);

        Scheme sSolar = new Scheme();
        sSolar.setCode("SCH-SOLAR-02");
        sSolar.setTitle("National Rural Solar & Green Energy Grant");
        sSolar.setDescription("Subsidies for installing rooftop solar pumps and agricultural microgrid equipment.");
        sSolar.setDepartment("Ministry of New and Renewable Energy");
        sSolar.setTotalBudget(new BigDecimal("100000000.00"));
        sSolar.setRemainingBudget(new BigDecimal("100000000.00"));
        sSolar.setMinGrantAmount(new BigDecimal("50000.00"));
        sSolar.setMaxGrantAmount(new BigDecimal("250000.00"));
        sSolar.setMinEligibilityScore(50);
        sSolar.setActive(true);

        sSolar.addCriterion(new EligibilityCriterion(sSolar, CriterionType.ANNUAL_INCOME, ComparisonOperator.LESS_THAN_OR_EQUAL, "400000", 50, true, "Annual income <= 400,000 INR"));
        sSolar.addCriterion(new EligibilityCriterion(sSolar, CriterionType.AGE, ComparisonOperator.GREATER_THAN_OR_EQUAL, "21", 50, true, "Applicant must be at least 21 years of age"));
        schemeRepository.save(sSolar);

        // 6. Sample Application in FIELD_VERIFICATION for demo
        SubsidyApplication demoApp = new SubsidyApplication();
        demoApp.setApplicationNumber("SUB-20260830-DEMO01");
        demoApp.setBeneficiary(b1);
        demoApp.setScheme(sAgri);
        demoApp.setRegion(rPune);
        demoApp.setAppliedAmount(new BigDecimal("100000.00"));
        demoApp.setApprovedAmount(BigDecimal.ZERO);
        demoApp.setStatus(ApplicationStatus.FIELD_VERIFICATION);
        demoApp.setRiskLevel(RiskLevel.LOW);
        demoApp.setEligibilityScore(100);

        demoApp.addDocument(new ApplicationDocument(demoApp, DocumentType.IDENTITY_PROOF, "aadhaar_card.pdf", "application/pdf", "uploads/documents/demo_aadhaar.pdf"));
        demoApp.addDocument(new ApplicationDocument(demoApp, DocumentType.INCOME_CERTIFICATE, "income_certificate.pdf", "application/pdf", "uploads/documents/demo_income.pdf"));
        demoApp.addDocument(new ApplicationDocument(demoApp, DocumentType.LAND_RECORD, "land_712_extract.pdf", "application/pdf", "uploads/documents/demo_land.pdf"));

        applicationRepository.save(demoApp);

        log.info("Seed data initialization finished successfully!");
    }

    private User createUser(String username, String rawPassword, String fullName, String email, String phone, Set<Role> roles) {
        User u = new User(username, passwordEncoder.encode(rawPassword), fullName, email, phone);
        u.setRoles(new HashSet<>(roles));
        return userRepository.save(u);
    }
}
