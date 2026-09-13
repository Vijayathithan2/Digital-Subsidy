-- Database Schema for Government Subsidy / Grant Disbursement Tracking System
-- Target: MySQL 8.x

CREATE DATABASE IF NOT EXISTS subsidy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE subsidy_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- User-Roles join table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Regions table
CREATE TABLE IF NOT EXISTS regions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    state_name VARCHAR(100) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    sub_district VARCHAR(100),
    allocated_budget DECIMAL(18,2) DEFAULT 0.00,
    utilized_budget DECIMAL(18,2) DEFAULT 0.00
);

-- Beneficiaries table
CREATE TABLE IF NOT EXISTS beneficiaries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    region_id BIGINT NOT NULL,
    identity_number VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(30) NOT NULL,
    date_of_birth DATE NOT NULL,
    annual_income DECIMAL(18,2) NOT NULL,
    land_holding_hectares DECIMAL(8,2) DEFAULT 0.00,
    is_disabled BOOLEAN DEFAULT FALSE,
    bank_account_number VARCHAR(50) NOT NULL,
    bank_ifsc_code VARCHAR(20) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    address_line TEXT NOT NULL,
    kyc_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- Schemes table
CREATE TABLE IF NOT EXISTS schemes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    department VARCHAR(100) NOT NULL,
    total_budget DECIMAL(18,2) NOT NULL,
    remaining_budget DECIMAL(18,2) NOT NULL,
    min_grant_amount DECIMAL(18,2) NOT NULL,
    max_grant_amount DECIMAL(18,2) NOT NULL,
    min_eligibility_score INT DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Eligibility Criteria table
CREATE TABLE IF NOT EXISTS eligibility_criteria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    scheme_id BIGINT NOT NULL,
    criterion_type VARCHAR(50) NOT NULL,
    comparison_operator VARCHAR(30) NOT NULL,
    expected_value VARCHAR(100) NOT NULL,
    weight_points INT NOT NULL,
    is_mandatory BOOLEAN DEFAULT FALSE,
    description VARCHAR(255),
    FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE
);

-- Subsidy Applications table
CREATE TABLE IF NOT EXISTS subsidy_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_number VARCHAR(50) NOT NULL UNIQUE,
    beneficiary_id BIGINT NOT NULL,
    scheme_id BIGINT NOT NULL,
    region_id BIGINT NOT NULL,
    applied_amount DECIMAL(18,2) NOT NULL,
    approved_amount DECIMAL(18,2) DEFAULT 0.00,
    status VARCHAR(50) NOT NULL,
    risk_level VARCHAR(30) NOT NULL DEFAULT 'LOW',
    eligibility_score INT DEFAULT 0,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
    FOREIGN KEY (scheme_id) REFERENCES schemes(id),
    FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- Application Documents table
CREATE TABLE IF NOT EXISTS application_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    verification_status VARCHAR(30) DEFAULT 'PENDING',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES subsidy_applications(id) ON DELETE CASCADE
);

-- Verifications table
CREATE TABLE IF NOT EXISTS verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    stage VARCHAR(50) NOT NULL,
    verified_by_user_id BIGINT NOT NULL,
    decision VARCHAR(30) NOT NULL,
    remarks TEXT,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES subsidy_applications(id),
    FOREIGN KEY (verified_by_user_id) REFERENCES users(id)
);

-- Disbursement Plans table
CREATE TABLE IF NOT EXISTS disbursement_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL UNIQUE,
    total_planned_amount DECIMAL(18,2) NOT NULL,
    total_released_amount DECIMAL(18,2) DEFAULT 0.00,
    total_remaining_amount DECIMAL(18,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES subsidy_applications(id)
);

-- Disbursement Milestones table
CREATE TABLE IF NOT EXISTS disbursement_milestones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plan_id BIGINT NOT NULL,
    sequence_number INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    milestone_type VARCHAR(50) NOT NULL,
    scheduled_amount DECIMAL(18,2) NOT NULL,
    due_date DATE NOT NULL,
    compliance_condition TEXT,
    is_compliance_satisfied BOOLEAN DEFAULT FALSE,
    release_status VARCHAR(30) DEFAULT 'PENDING',
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (plan_id) REFERENCES disbursement_plans(id) ON DELETE CASCADE
);

-- Fund Releases table
CREATE TABLE IF NOT EXISTS fund_releases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    milestone_id BIGINT NOT NULL UNIQUE,
    transaction_ref_number VARCHAR(100) NOT NULL UNIQUE,
    released_amount DECIMAL(18,2) NOT NULL,
    released_by_user_id BIGINT NOT NULL,
    payment_mode VARCHAR(50) DEFAULT 'DIRECT_BENEFIT_TRANSFER',
    treasury_status VARCHAR(30) DEFAULT 'PROCESSED',
    released_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (milestone_id) REFERENCES disbursement_milestones(id),
    FOREIGN KEY (released_by_user_id) REFERENCES users(id)
);

-- Fund Utilizations table
CREATE TABLE IF NOT EXISTS fund_utilizations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    utilized_amount DECIMAL(18,2) NOT NULL,
    proof_document_path VARCHAR(500),
    remarks TEXT,
    verification_status VARCHAR(30) DEFAULT 'PENDING',
    verified_by_user_id BIGINT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES subsidy_applications(id),
    FOREIGN KEY (verified_by_user_id) REFERENCES users(id)
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    previous_state VARCHAR(100),
    new_state VARCHAR(100),
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
