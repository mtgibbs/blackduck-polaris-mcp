import * as policiesApi from "../api/policies.ts";
import type {
  BulkAssignmentsPayload,
  IssuePolicy,
  IssuePolicyPayload,
  PolicyAction,
  PolicyAssignment,
  PolicySettingsPayload,
  PrPolicy,
  PrPolicyPayload,
  TestSchedulingPolicy,
  TestSchedulingPolicyPayload,
} from "../types/polaris.ts";

// --- Issue Policies ---

export interface GetIssuePoliciesOptions {
  filter?: string;
  offset?: number;
  limit?: number;
  associationId?: string;
}

export function getIssuePolicies(
  options?: GetIssuePoliciesOptions,
): Promise<IssuePolicy[]> {
  return policiesApi.getIssuePolicies(options);
}

export function getIssuePolicy(id: string): Promise<IssuePolicy> {
  return policiesApi.getIssuePolicy(id);
}

export interface CreateIssuePolicyOptions {
  name: string;
  description?: string;
  filterGroups?: Array<{
    rules: Array<{
      ruleNumber: number;
      powerFilterQuery: string;
      actions?: string[];
      fixByRule?: Array<{
        fixByAction: string;
        fixByPeriod: number;
      }>;
    }>;
  }>;
}

export function createIssuePolicy(
  options: CreateIssuePolicyOptions,
): Promise<IssuePolicy> {
  const payload: IssuePolicyPayload = {
    name: options.name,
    description: options.description,
    filterGroups: options.filterGroups,
  };
  return policiesApi.createIssuePolicy(payload);
}

export interface UpdateIssuePolicyOptions {
  id: string;
  name: string;
  description?: string;
  filterGroups?: Array<{
    rules: Array<{
      ruleNumber: number;
      powerFilterQuery: string;
      actions?: string[];
      fixByRule?: Array<{
        fixByAction: string;
        fixByPeriod: number;
      }>;
    }>;
  }>;
}

export function updateIssuePolicy(
  options: UpdateIssuePolicyOptions,
): Promise<IssuePolicy> {
  const payload: IssuePolicyPayload = {
    name: options.name,
    description: options.description,
    filterGroups: options.filterGroups,
  };
  return policiesApi.updateIssuePolicy(options.id, payload);
}

export function deleteIssuePolicy(id: string): Promise<void> {
  return policiesApi.deleteIssuePolicy(id);
}

// --- PR Policies ---

export interface GetPrPoliciesOptions {
  filter?: string;
  offset?: number;
  limit?: number;
}

export function getPrPolicies(
  options?: GetPrPoliciesOptions,
): Promise<PrPolicy[]> {
  return policiesApi.getPrPolicies(options);
}

export function getPrPolicy(id: string): Promise<PrPolicy> {
  return policiesApi.getPrPolicy(id);
}

export interface CreatePrPolicyOptions {
  name: string;
  description?: string;
  rules?: Array<{
    ruleNumber: number;
    criteriaQuery: string;
    actions?: string[];
  }>;
}

export function createPrPolicy(
  options: CreatePrPolicyOptions,
): Promise<PrPolicy> {
  const payload: PrPolicyPayload = {
    name: options.name,
    description: options.description,
    rules: options.rules,
  };
  return policiesApi.createPrPolicy(payload);
}

export interface UpdatePrPolicyOptions {
  id: string;
  name: string;
  description?: string;
  rules?: Array<{
    ruleNumber: number;
    criteriaQuery: string;
    actions?: string[];
  }>;
}

export function updatePrPolicy(
  options: UpdatePrPolicyOptions,
): Promise<PrPolicy> {
  const payload: PrPolicyPayload = {
    name: options.name,
    description: options.description,
    rules: options.rules,
  };
  return policiesApi.updatePrPolicy(options.id, payload);
}

export function deletePrPolicy(id: string): Promise<void> {
  return policiesApi.deletePrPolicy(id);
}

// --- Test Scheduling Policies ---

export interface GetTestSchedulingPoliciesOptions {
  filter?: string;
  offset?: number;
  limit?: number;
}

export function getTestSchedulingPolicies(
  options?: GetTestSchedulingPoliciesOptions,
): Promise<TestSchedulingPolicy[]> {
  return policiesApi.getTestSchedulingPolicies(options);
}

export function getTestSchedulingPolicy(id: string): Promise<TestSchedulingPolicy> {
  return policiesApi.getTestSchedulingPolicy(id);
}

export interface CreateTestSchedulingPolicyOptions {
  name: string;
  description?: string;
  scheduleGroups?: Array<{
    rules: Array<{
      ruleNumber: number;
      frequency: "daily" | "weekly";
    }>;
  }>;
}

export function createTestSchedulingPolicy(
  options: CreateTestSchedulingPolicyOptions,
): Promise<TestSchedulingPolicy> {
  const payload: TestSchedulingPolicyPayload = {
    name: options.name,
    description: options.description,
    scheduleGroups: options.scheduleGroups,
  };
  return policiesApi.createTestSchedulingPolicy(payload);
}

export interface UpdateTestSchedulingPolicyOptions {
  id: string;
  name: string;
  description?: string;
  scheduleGroups?: Array<{
    rules: Array<{
      ruleNumber: number;
      frequency: "daily" | "weekly";
    }>;
  }>;
}

export function updateTestSchedulingPolicy(
  options: UpdateTestSchedulingPolicyOptions,
): Promise<TestSchedulingPolicy> {
  const payload: TestSchedulingPolicyPayload = {
    name: options.name,
    description: options.description,
    scheduleGroups: options.scheduleGroups,
  };
  return policiesApi.updateTestSchedulingPolicy(options.id, payload);
}

// --- Policy Assignments V2 ---

export interface GetPolicyAssignmentsOptions {
  filter: string;
  offset?: number;
  limit?: number;
}

export function getPolicyAssignments(
  options: GetPolicyAssignmentsOptions,
): Promise<PolicyAssignment[]> {
  return policiesApi.getPolicyAssignments(options);
}

export function getPolicyAssignment(id: string): Promise<PolicyAssignment> {
  return policiesApi.getPolicyAssignment(id);
}

export interface CreatePolicyAssignmentsOptions {
  assignments: Array<{
    type: string;
    associationId: string;
    policyId: string;
  }>;
}

export function createPolicyAssignments(
  options: CreatePolicyAssignmentsOptions,
): Promise<void> {
  const payload: BulkAssignmentsPayload = {
    assignments: options.assignments,
  };
  return policiesApi.createPolicyAssignments(payload);
}

export interface DeletePolicyAssignmentsOptions {
  assignments: Array<{
    type: string;
    associationId: string;
    policyId: string;
  }>;
}

export function deletePolicyAssignments(
  options: DeletePolicyAssignmentsOptions,
): Promise<void> {
  const payload: BulkAssignmentsPayload = {
    assignments: options.assignments,
  };
  return policiesApi.deletePolicyAssignments(payload);
}

// --- Policy Actions ---

export interface GetPolicyActionsOptions {
  filter?: string;
  offset?: number;
  limit?: number;
}

export function getPolicyActions(
  options?: GetPolicyActionsOptions,
): Promise<PolicyAction[]> {
  return policiesApi.getPolicyActions(options);
}

export function getPolicyAction(id: string): Promise<PolicyAction> {
  return policiesApi.getPolicyAction(id);
}

// --- Policy Settings ---

export interface UpdatePolicySettingsOptions {
  policyId: string;
  defaultPolicyStatus: boolean;
}

export function updatePolicySettings(
  options: UpdatePolicySettingsOptions,
): Promise<void> {
  const payload: PolicySettingsPayload = {
    policyId: options.policyId,
    defaultPolicyStatus: options.defaultPolicyStatus,
  };
  return policiesApi.updatePolicySettings(payload);
}
