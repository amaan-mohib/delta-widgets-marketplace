// The TypeScript definitions below are automatically generated.
// Do not touch them, or risk, your modifications being lost.

export enum Table {
  NeonAuthAccount = "neon_auth.account",
  NeonAuthInvitation = "neon_auth.invitation",
  NeonAuthJwks = "neon_auth.jwks",
  NeonAuthMember = "neon_auth.member",
  NeonAuthOrganization = "neon_auth.organization",
  NeonAuthProjectConfig = "neon_auth.project_config",
  NeonAuthSession = "neon_auth.session",
  NeonAuthUser = "neon_auth.user",
  NeonAuthVerification = "neon_auth.verification",
  Assets = "assets",
  Categories = "categories",
  KnexMigrations = "knex_migrations",
  KnexMigrationsLock = "knex_migrations_lock",
  UploadJobFiles = "upload_job_files",
  UploadJobs = "upload_jobs",
  UserProfiles = "user_profiles",
  Waitlists = "waitlists",
  WidgetAssets = "widget_assets",
  WidgetAudits = "widget_audits",
  WidgetCategories = "widget_categories",
  WidgetLikes = "widget_likes",
  WidgetVersionAssets = "widget_version_assets",
  WidgetVersionCategories = "widget_version_categories",
  WidgetVersions = "widget_versions",
  Widgets = "widgets",
}

export type Tables = {
  "neon_auth.account": NeonAuthAccount,
  "neon_auth.invitation": NeonAuthInvitation,
  "neon_auth.jwks": NeonAuthJwks,
  "neon_auth.member": NeonAuthMember,
  "neon_auth.organization": NeonAuthOrganization,
  "neon_auth.project_config": NeonAuthProjectConfig,
  "neon_auth.session": NeonAuthSession,
  "neon_auth.user": NeonAuthUser,
  "neon_auth.verification": NeonAuthVerification,
  "assets": Assets,
  "categories": Categories,
  "knex_migrations": KnexMigrations,
  "knex_migrations_lock": KnexMigrationsLock,
  "upload_job_files": UploadJobFiles,
  "upload_jobs": UploadJobs,
  "user_profiles": UserProfiles,
  "waitlists": Waitlists,
  "widget_assets": WidgetAssets,
  "widget_audits": WidgetAudits,
  "widget_categories": WidgetCategories,
  "widget_likes": WidgetLikes,
  "widget_version_assets": WidgetVersionAssets,
  "widget_version_categories": WidgetVersionCategories,
  "widget_versions": WidgetVersions,
  "widgets": Widgets,
};

export type NeonAuthAccount = {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type NeonAuthInvitation = {
  id: string;
  organizationId: string;
  email: string;
  role: string | null;
  status: string;
  expiresAt: Date;
  createdAt: Date;
  inviterId: string;
};

export type NeonAuthJwks = {
  id: string;
  publicKey: string;
  privateKey: string;
  createdAt: Date;
  expiresAt: Date | null;
};

export type NeonAuthMember = {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: Date;
};

export type NeonAuthOrganization = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: Date;
  metadata: string | null;
};

export type NeonAuthProjectConfig = {
  id: string;
  name: string;
  endpoint_id: string;
  created_at: Date;
  updated_at: Date;
  trusted_origins: unknown;
  social_providers: unknown;
  email_provider: unknown | null;
  email_and_password: unknown | null;
  allow_localhost: boolean;
  plugin_configs: unknown | null;
  webhook_config: unknown | null;
};

export type NeonAuthSession = {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
  impersonatedBy: string | null;
  activeOrganizationId: string | null;
};

export type NeonAuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
};

export type NeonAuthVerification = {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Assets = {
  id: number;
  src: string;
  file_name: string;
  size: number | null;
  content_type: string | null;
  asset_type: string | null;
  created_at: Date;
  updated_at: Date;
};

export type Categories = {
  id: number;
  slug: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  count: string | null;
};

export type KnexMigrations = {
  id: number;
  name: string | null;
  batch: number | null;
  migration_time: Date | null;
};

export type KnexMigrationsLock = {
  index: number;
  is_locked: number | null;
};

export type UploadJobFiles = {
  id: number;
  job_id: number;
  status: string;
  object_key: string;
  file_name: string;
  options: string | null;
  created_at: Date;
  updated_at: Date;
  sort_order: number;
};

export type UploadJobs = {
  id: number;
  user_id: string;
  widget_version_id: number;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export type UserProfiles = {
  id: number;
  user_id: string;
  username: string;
  created_at: Date;
  updated_at: Date;
};

export type Waitlists = {
  email: string;
};

export type WidgetAssets = {
  widget_id: number;
  asset_id: number;
};

export type WidgetAudits = {
  id: number;
  widget_version_id: number;
  auditor_id: string | null;
  action: string;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
};

export type WidgetCategories = {
  widget_id: number;
  category_id: number;
};

export type WidgetLikes = {
  widget_id: number;
  user_id: string | null;
  anon_user_id: string | null;
};

export type WidgetVersionAssets = {
  widget_version_id: number;
  asset_id: number;
  sort_order: number;
};

export type WidgetVersionCategories = {
  widget_version_id: number;
  category_id: number;
};

export type WidgetVersions = {
  id: number;
  widget_id: number;
  version: string;
  changelog: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
  revision: number | null;
  label: string;
  description: string | null;
};

export type Widgets = {
  id: number;
  author_id: string;
  key: string;
  widget_type: string;
  download_count: string | null;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
  likes: string | null;
};

