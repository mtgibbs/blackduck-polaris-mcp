import { getClient as _getClient } from "./client.ts";

// --- Media Type Constants ---

export const ACCEPT_REPO_LIST =
  "application/vnd.polaris.integrations.repos.repo-list-1+json;charset=UTF-8";
export const ACCEPT_REPO = "application/vnd.polaris.integrations.repos.repo-1+json;charset=UTF-8";
export const ACCEPT_REPO_CREATE =
  "application/vnd.polaris.integrations.repos.repo-create-1+json;charset=UTF-8";
export const ACCEPT_REPO_UPDATE =
  "application/vnd.polaris.integrations.repos.repo-update-1+json;charset=UTF-8";
export const ACCEPT_REPO_CONNECTION =
  "application/vnd.polaris.integrations.repos.repo-connection-1+json;charset=UTF-8";
export const ACCEPT_CONNECTION_REQUEST =
  "application/vnd.polaris.integrations.repos.connection-request-1+json;charset=UTF-8";
export const ACCEPT_BRANCH_LIST =
  "application/vnd.polaris.integrations.repos.repo-branch-list-1+json;charset=UTF-8";
export const ACCEPT_GROUPS_AUTH =
  "application/vnd.polaris.integrations.repos.scm.groups-auth-1+json;charset=UTF-8";
export const ACCEPT_PROVIDERS_LIST = "application/vnd.scm.providers-list-1+json;charset=UTF-8";
export const ACCEPT_BULK_REPO_IMPORT =
  "application/vnd.polaris.integrations.repos.bulk-repo-import-1+json;charset=UTF-8";
export const ACCEPT_BULK_REPO_IMPORT_GROUPS_STATUS =
  "application/vnd.polaris.integrations.repos.bulk-repo-import-groups-status-1+json;charset=UTF-8";
export const ACCEPT_BULK_GROUP_IMPORT =
  "application/vnd.polaris.integrations.repos.bulk-group-import-1+json;charset=UTF-8";
export const ACCEPT_BULK_GROUP_IMPORT_STATUS =
  "application/vnd.polaris.integrations.repos.bulk-group-import-status-1+json;charset=UTF-8";
export const ACCEPT_SCM_CONNECTION =
  "application/vnd.polaris.integrations.repos.scm.repo-connection-1+json;charset=UTF-8";
export const ACCEPT_SCM_GROUPS =
  "application/vnd.polaris.integrations.repos.scm.group-list-1+json;charset=UTF-8";
export const ACCEPT_SCM_REPOS =
  "application/vnd.polaris.integrations.repos.scm.repo-list-1+json;charset=UTF-8";
export const ACCEPT_SCM_PROJECTS =
  "application/vnd.polaris.integrations.repos.scm.project-list-1+json;charset=UTF-8";
export const ACCEPT_GROUPS_SETTINGS_UPDATE =
  "application/vnd.polaris.integrations.repos.groups-settings-update-1+json;charset=UTF-8";
export const ACCEPT_GROUPS_SETTINGS =
  "application/vnd.polaris.integrations.repos.groups-settings-1+json;charset=UTF-8";
export const ACCEPT_GROUP_CONNECTION_REQUEST =
  "application/vnd.polaris.integrations.repos.groups-connection-request-1+json;charset=UTF-8";
export const ACCEPT_GROUP_MAPPING_STATUS =
  "application/vnd.polaris.integrations.repos.group-mapping-status-1+json";
export const ACCEPT_TEST_SETTINGS_CREATE =
  "application/vnd.polaris.integrations.repos.test-settings-create-1+json;charset=UTF-8";
export const ACCEPT_TEST_SETTINGS = "application/vnd.polaris.integrations.repos.test-settings+json";
