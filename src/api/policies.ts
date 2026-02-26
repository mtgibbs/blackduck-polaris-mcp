import { getClient } from "./client.ts";
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

const ISSUE_POLICY_MEDIA_TYPE = "application/vnd.polaris.policies.issue-policy-1+json";

export interface GetIssuePoliciesParams {
  filter?: string;
  offset?: number;
  limit?: number;
  associationId?: string;
}

export function getIssuePolicies(
  params?: GetIssuePoliciesParams,
): Promise<IssuePolicy[]> {
  const client = getClient();
  const queryParams: Record<string, string | number | undefined> = {};
  if (params?.filter) queryParams._filter = params.filter;
  if (params?.offset !== undefined) queryParams._offset = params.offset;
  if (params?.limit !== undefined) queryParams._limit = params.limit;
  if (params?.associationId) queryParams.associationId = params.associationId;

  return client.getAllOffset<IssuePolicy>(
    "/api/policies/issue-policies",
    queryParams,
    ISSUE_POLICY_MEDIA_TYPE,
    100,
  );
}

export function getIssuePolicy(id: string): Promise<IssuePolicy> {
  const client = getClient();
  return client.get<IssuePolicy>(
    `/api/policies/issue-policies/${id}`,
    undefined,
    ISSUE_POLICY_MEDIA_TYPE,
  );
}

export function createIssuePolicy(
  body: IssuePolicyPayload,
): Promise<IssuePolicy> {
  const client = getClient();
  return client.fetch<IssuePolicy>(
    "/api/policies/issue-policies",
    {
      method: "POST",
      body,
      accept: ISSUE_POLICY_MEDIA_TYPE,
      contentType: ISSUE_POLICY_MEDIA_TYPE,
    },
  );
}

export function updateIssuePolicy(
  id: string,
  body: IssuePolicyPayload,
): Promise<IssuePolicy> {
  const client = getClient();
  return client.fetch<IssuePolicy>(
    `/api/policies/issue-policies/${id}`,
    {
      method: "PUT",
      body,
      accept: ISSUE_POLICY_MEDIA_TYPE,
      contentType: ISSUE_POLICY_MEDIA_TYPE,
    },
  );
}

export function deleteIssuePolicy(id: string): Promise<void> {
  const client = getClient();
  return client.fetch<void>(
    `/api/policies/issue-policies/${id}`,
    {
      method: "DELETE",
      accept: ISSUE_POLICY_MEDIA_TYPE,
    },
  );
}

// --- PR Policies ---

const PR_POLICY_MEDIA_TYPE = "application/vnd.polaris.policies.pr-policies-1+json";

export interface GetPrPoliciesParams {
  filter?: string;
  offset?: number;
  limit?: number;
}

export function getPrPolicies(
  params?: GetPrPoliciesParams,
): Promise<PrPolicy[]> {
  const client = getClient();
  const queryParams: Record<string, string | number | undefined> = {};
  if (params?.filter) queryParams._filter = params.filter;
  if (params?.offset !== undefined) queryParams._offset = params.offset;
  if (params?.limit !== undefined) queryParams._limit = params.limit;

  return client.getAllOffset<PrPolicy>(
    "/api/policies/pr-policies",
    queryParams,
    PR_POLICY_MEDIA_TYPE,
    100,
  );
}

export function getPrPolicy(id: string): Promise<PrPolicy> {
  const client = getClient();
  return client.get<PrPolicy>(
    `/api/policies/pr-policies/${id}`,
    undefined,
    PR_POLICY_MEDIA_TYPE,
  );
}

export function createPrPolicy(
  body: PrPolicyPayload,
): Promise<PrPolicy> {
  const client = getClient();
  return client.fetch<PrPolicy>(
    "/api/policies/pr-policies",
    {
      method: "POST",
      body,
      accept: PR_POLICY_MEDIA_TYPE,
      contentType: PR_POLICY_MEDIA_TYPE,
    },
  );
}

export function updatePrPolicy(
  id: string,
  body: PrPolicyPayload,
): Promise<PrPolicy> {
  const client = getClient();
  return client.fetch<PrPolicy>(
    `/api/policies/pr-policies/${id}`,
    {
      method: "PUT",
      body,
      accept: PR_POLICY_MEDIA_TYPE,
      contentType: PR_POLICY_MEDIA_TYPE,
    },
  );
}

export function deletePrPolicy(id: string): Promise<void> {
  const client = getClient();
  return client.fetch<void>(
    `/api/policies/pr-policies/${id}`,
    {
      method: "DELETE",
      accept: PR_POLICY_MEDIA_TYPE,
    },
  );
}

// --- Test Scheduling Policies ---

const TEST_SCHEDULING_POLICY_MEDIA_TYPE =
  "application/vnd.polaris.policies.test-scheduling-policy-1+json";

export interface GetTestSchedulingPoliciesParams {
  filter?: string;
  offset?: number;
  limit?: number;
}

export function getTestSchedulingPolicies(
  params?: GetTestSchedulingPoliciesParams,
): Promise<TestSchedulingPolicy[]> {
  const client = getClient();
  const queryParams: Record<string, string | number | undefined> = {};
  if (params?.filter) queryParams._filter = params.filter;
  if (params?.offset !== undefined) queryParams._offset = params.offset;
  if (params?.limit !== undefined) queryParams._limit = params.limit;

  return client.getAllOffset<TestSchedulingPolicy>(
    "/api/policies/test-scheduling-policies",
    queryParams,
    TEST_SCHEDULING_POLICY_MEDIA_TYPE,
    100,
  );
}

export function getTestSchedulingPolicy(id: string): Promise<TestSchedulingPolicy> {
  const client = getClient();
  return client.get<TestSchedulingPolicy>(
    `/api/policies/test-scheduling-policies/${id}`,
    undefined,
    TEST_SCHEDULING_POLICY_MEDIA_TYPE,
  );
}

export function createTestSchedulingPolicy(
  body: TestSchedulingPolicyPayload,
): Promise<TestSchedulingPolicy> {
  const client = getClient();
  return client.fetch<TestSchedulingPolicy>(
    "/api/policies/test-scheduling-policies",
    {
      method: "POST",
      body,
      accept: TEST_SCHEDULING_POLICY_MEDIA_TYPE,
      contentType: TEST_SCHEDULING_POLICY_MEDIA_TYPE,
    },
  );
}

export function updateTestSchedulingPolicy(
  id: string,
  body: TestSchedulingPolicyPayload,
): Promise<TestSchedulingPolicy> {
  const client = getClient();
  return client.fetch<TestSchedulingPolicy>(
    `/api/policies/test-scheduling-policies/${id}`,
    {
      method: "PUT",
      body,
      accept: TEST_SCHEDULING_POLICY_MEDIA_TYPE,
      contentType: TEST_SCHEDULING_POLICY_MEDIA_TYPE,
    },
  );
}

// --- Policy Assignments V2 ---

const POLICY_ASSIGNMENT_MEDIA_TYPE =
  "application/vnd.polaris.policies.policy-bulk-assignment-2+json";

export interface GetPolicyAssignmentsParams {
  filter: string;
  offset?: number;
  limit?: number;
}

export function getPolicyAssignments(
  params: GetPolicyAssignmentsParams,
): Promise<PolicyAssignment[]> {
  const client = getClient();
  const queryParams: Record<string, string | number | undefined> = {
    _filter: params.filter,
  };
  if (params.offset !== undefined) queryParams._offset = params.offset;
  if (params.limit !== undefined) queryParams._limit = params.limit;

  return client.getAllOffset<PolicyAssignment>(
    "/api/policies/assignments",
    queryParams,
    POLICY_ASSIGNMENT_MEDIA_TYPE,
    100,
  );
}

export function getPolicyAssignment(id: string): Promise<PolicyAssignment> {
  const client = getClient();
  return client.get<PolicyAssignment>(
    `/api/policies/assignments/${id}`,
    undefined,
    POLICY_ASSIGNMENT_MEDIA_TYPE,
  );
}

export function createPolicyAssignments(
  body: BulkAssignmentsPayload,
): Promise<void> {
  const client = getClient();
  return client.fetch<void>(
    "/api/policies/assignments",
    {
      method: "POST",
      body,
      accept: POLICY_ASSIGNMENT_MEDIA_TYPE,
      contentType: POLICY_ASSIGNMENT_MEDIA_TYPE,
    },
  );
}

export function deletePolicyAssignments(
  body: BulkAssignmentsPayload,
): Promise<void> {
  const client = getClient();
  return client.fetch<void>(
    "/api/policies/assignments",
    {
      method: "DELETE",
      body,
      accept: POLICY_ASSIGNMENT_MEDIA_TYPE,
      contentType: POLICY_ASSIGNMENT_MEDIA_TYPE,
    },
  );
}

// --- Policy Actions ---

const POLICY_ACTION_MEDIA_TYPE = "application/vnd.polaris.policies.action-1+json";

export interface GetPolicyActionsParams {
  filter?: string;
  offset?: number;
  limit?: number;
}

export function getPolicyActions(
  params?: GetPolicyActionsParams,
): Promise<PolicyAction[]> {
  const client = getClient();
  const queryParams: Record<string, string | number | undefined> = {};
  if (params?.filter) queryParams._filter = params.filter;
  if (params?.offset !== undefined) queryParams._offset = params.offset;
  if (params?.limit !== undefined) queryParams._limit = params.limit;

  return client.getAllOffset<PolicyAction>(
    "/api/policies/actions",
    queryParams,
    POLICY_ACTION_MEDIA_TYPE,
    100,
  );
}

export function getPolicyAction(id: string): Promise<PolicyAction> {
  const client = getClient();
  return client.get<PolicyAction>(
    `/api/policies/actions/${id}`,
    undefined,
    POLICY_ACTION_MEDIA_TYPE,
  );
}

// --- Policy Settings ---

export function updatePolicySettings(
  body: PolicySettingsPayload,
): Promise<void> {
  const client = getClient();
  return client.fetch<void>(
    "/api/policies/policy-settings",
    {
      method: "POST",
      body,
      contentType: "application/json",
    },
  );
}
