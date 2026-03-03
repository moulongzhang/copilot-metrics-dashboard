// Copilot Metrics API response (GET /orgs/{org}/copilot/metrics)
// Returns an array of daily metrics

export interface CopilotMetricsDay {
  date: string; // YYYY-MM-DD
  total_active_users: number;
  total_engaged_users: number;
  copilot_ide_code_completions: CopilotIdeCodeCompletions | null;
  copilot_ide_chat: CopilotIdeChat | null;
  copilot_dotcom_chat: CopilotDotcomChat | null;
  copilot_dotcom_pull_requests: CopilotDotcomPullRequests | null;
}

export interface CopilotIdeCodeCompletions {
  total_engaged_users: number;
  languages: LanguageSummary[];
  editors: EditorCompletions[];
}

export interface LanguageSummary {
  name: string;
  total_engaged_users: number;
}

export interface EditorCompletions {
  name: string;
  total_engaged_users: number;
  models: CompletionModel[];
}

export interface CompletionModel {
  name: string;
  is_custom_model: boolean;
  custom_model_training_date: string | null;
  total_engaged_users: number;
  languages: LanguageCompletionMetrics[];
}

export interface LanguageCompletionMetrics {
  name: string;
  total_engaged_users: number;
  total_code_suggestions: number;
  total_code_acceptances: number;
  total_code_lines_suggested: number;
  total_code_lines_accepted: number;
}

export interface CopilotIdeChat {
  total_engaged_users: number;
  editors: EditorChat[];
}

export interface EditorChat {
  name: string;
  total_engaged_users: number;
  models: ChatModel[];
}

export interface ChatModel {
  name: string;
  is_custom_model: boolean;
  custom_model_training_date: string | null;
  total_engaged_users: number;
  total_chats: number;
  total_chat_insertion_events: number;
  total_chat_copy_events: number;
}

export interface CopilotDotcomChat {
  total_engaged_users: number;
  models: DotcomChatModel[];
}

export interface DotcomChatModel {
  name: string;
  is_custom_model: boolean;
  custom_model_training_date: string | null;
  total_engaged_users: number;
  total_chats: number;
}

export interface CopilotDotcomPullRequests {
  total_engaged_users: number;
  repositories: RepositoryPRMetrics[];
}

export interface RepositoryPRMetrics {
  name: string;
  total_engaged_users: number;
  models: PRModel[];
}

export interface PRModel {
  name: string;
  is_custom_model: boolean;
  custom_model_training_date: string | null;
  total_pr_summaries_created: number;
  total_engaged_users: number;
}

// Usage Metrics API types (NDJSON download)
export interface UsageReportResponse {
  download_links: string[];
  report_day?: string;
  report_start_day?: string;
  report_end_day?: string;
}

// User-level metrics from NDJSON reports
export interface UserMetricsRecord {
  day: string;
  user_id: number;
  user_login: string;
  organization_id?: number;
  user_initiated_interaction_count: number;
  code_generation_activity_count: number;
  code_acceptance_activity_count: number;
  loc_suggested_to_add_sum: number;
  loc_suggested_to_delete_sum: number;
  loc_added_sum: number;
  loc_deleted_sum: number;
  chat_panel_ask_mode?: number;
  chat_panel_edit_mode?: number;
  chat_panel_plan_mode?: number;
  chat_panel_agent_mode?: number;
  chat_panel_custom_mode?: number;
  chat_panel_unknown_mode?: number;
  agent_edit?: {
    loc_added_sum: number;
    loc_deleted_sum: number;
  };
  last_known_ide_version?: string;
  last_known_plugin_version?: string;
  totals_by_ide?: Record<string, unknown>[];
  totals_by_feature?: Record<string, unknown>[];
  totals_by_language_feature?: Record<string, unknown>[];
}

// Copilot Seats API types
export interface CopilotSeatsResponse {
  total_seats: number;
  seats: CopilotSeat[];
}

export interface CopilotSeat {
  created_at: string;
  updated_at: string;
  pending_cancellation_date: string | null;
  last_activity_at: string | null;
  last_activity_editor: string | null;
  plan_type: string;
  assignee: GitHubUser;
  assigning_team: { name: string; id: number } | null;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
}

// Organization member
export interface OrgMember {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
}

// Aggregated metrics for display
export interface AggregatedCompletionMetrics {
  totalSuggestions: number;
  totalAcceptances: number;
  totalLinesSuggested: number;
  totalLinesAccepted: number;
  acceptanceRate: number;
}

export interface DailyTrend {
  date: string;
  activeUsers: number;
  engagedUsers: number;
  suggestions: number;
  acceptances: number;
  acceptanceRate: number;
  totalChats: number;
  totalInsertions: number;
  totalCopies: number;
}

// Pull request metrics from usage reports
export interface PullRequestMetrics {
  total_created: number;
  total_reviewed: number;
  total_merged: number;
  median_minutes_to_merge: number;
  total_suggestions: number;
  total_applied_suggestions: number;
  total_created_by_copilot: number;
  total_reviewed_by_copilot: number;
  total_merged_created_by_copilot: number;
  median_minutes_to_merge_copilot_authored: number;
  total_copilot_suggestions: number;
  total_copilot_applied_suggestions: number;
}

// === Usage Metrics API Types (NDJSON) ===

export interface OrgUsageReport {
  report_start_day: string;
  report_end_day: string;
  organization_id: string;
  enterprise_id: string;
  created_at: string;
  day_totals: OrgDayTotals[];
}

export interface OrgDayTotals {
  day: string;
  organization_id: string;
  enterprise_id: string;
  daily_active_users: number;
  weekly_active_users: number;
  monthly_active_users: number;
  monthly_active_chat_users: number;
  monthly_active_agent_users: number;
  user_initiated_interaction_count: number;
  code_generation_activity_count: number;
  code_acceptance_activity_count: number;
  totals_by_ide: TotalsByIde[];
  totals_by_feature: TotalsByFeature[];
  totals_by_language_feature: TotalsByLanguageFeature[];
  totals_by_language_model: TotalsByLanguageModel[];
  totals_by_model_feature: TotalsByModelFeature[];
  loc_suggested_to_add_sum: number;
  loc_suggested_to_delete_sum: number;
  loc_added_sum: number;
  loc_deleted_sum: number;
  pull_requests?: PullRequestMetrics;
}

export interface TotalsByIde {
  ide: string;
  user_initiated_interaction_count: number;
  code_generation_activity_count: number;
  code_acceptance_activity_count: number;
  loc_suggested_to_add_sum: number;
  loc_suggested_to_delete_sum: number;
  loc_added_sum: number;
  loc_deleted_sum: number;
}

export interface TotalsByFeature {
  feature: string;
  user_initiated_interaction_count: number;
  code_generation_activity_count: number;
  code_acceptance_activity_count: number;
  loc_suggested_to_add_sum: number;
  loc_suggested_to_delete_sum: number;
  loc_added_sum: number;
  loc_deleted_sum: number;
}

export interface TotalsByLanguageFeature {
  language: string;
  feature: string;
  code_generation_activity_count: number;
  code_acceptance_activity_count: number;
  loc_suggested_to_add_sum: number;
  loc_suggested_to_delete_sum: number;
  loc_added_sum: number;
  loc_deleted_sum: number;
}

export interface TotalsByLanguageModel {
  language: string;
  model: string;
  code_generation_activity_count: number;
  code_acceptance_activity_count: number;
  loc_suggested_to_add_sum: number;
  loc_suggested_to_delete_sum: number;
  loc_added_sum: number;
  loc_deleted_sum: number;
}

export interface TotalsByModelFeature {
  model: string;
  feature: string;
  user_initiated_interaction_count: number;
  code_generation_activity_count: number;
  code_acceptance_activity_count: number;
  loc_suggested_to_add_sum: number;
  loc_suggested_to_delete_sum: number;
  loc_added_sum: number;
  loc_deleted_sum: number;
}

export interface UserUsageRecord {
  report_start_day: string;
  report_end_day: string;
  day: string;
  organization_id: string;
  enterprise_id: string;
  user_id: number;
  user_login: string;
  user_initiated_interaction_count: number;
  code_generation_activity_count: number;
  code_acceptance_activity_count: number;
  totals_by_ide: TotalsByIde[];
  totals_by_feature: TotalsByFeature[];
  totals_by_language_feature: TotalsByLanguageFeature[];
  totals_by_language_model: TotalsByLanguageModel[];
  totals_by_model_feature: TotalsByModelFeature[];
  used_agent: boolean;
  used_chat: boolean;
  loc_suggested_to_add_sum: number;
  loc_suggested_to_delete_sum: number;
  loc_added_sum: number;
  loc_deleted_sum: number;
}
