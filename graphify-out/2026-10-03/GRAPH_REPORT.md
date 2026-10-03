# Graph Report - VertexTarget  (2026-10-02)

## Corpus Check
- 314 files · ~248,273 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: .log 2, (none) 2, .frag 2)

## Summary
- 1142 nodes · 2360 edges · 69 communities (54 shown, 15 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Auth & Session Management
- Auth & Session Management
- Auth & Session Management
- Auth & Session Management
- Auth & Session Management
- Auth & Session Management
- Vertex Platform & Dashboard
- UI Primitives & Design System
- UI Primitives & Design System
- Server.Cjs Module
- Hero & Presentation
- Tests & Verification
- API Routes & Endpoints
- Vertex Platform & Dashboard
- Vertex Platform & Dashboard
- Auth & Session Management
- Admin Backoffice
- Auth & Session Management
- Auth & Session Management
- Auth & Session Management
- Project Config & Build
- UI Primitives & Design System
- UI Primitives & Design System
- Tests & Verification
- Tests & Verification
- I18N.Ts Module
- Project Config & Build
- Project Config & Build
- Lucide React Module
- Auth & Session Management
- Auth & Session Management
- Abc Module
- Broadcast() Module
- UI Primitives & Design System
- Tests & Verification
- Project Config & Build
- Hero & Presentation
- Create Connection() Module
- Agent Loop() Module
- Auth & Session Management
- Project Config & Build
- Auth & Session Management
- Vertex Platform & Dashboard
- Generate Report.Py Module
- Connections.Py Module
- With Server.Py Module
- UI Primitives & Design System
- Stop Server.Sh Module
- Project Config & Build
- API Routes & Endpoints
- Render Graphs.Js Module
- Animation & Smooth Scroll
- Stripe.Ts Module
- .Call Tool() Module
- Condition Based Waiting E Module
- Shaders.D.Ts Module
- Start Server.Sh Module
- Sdd Workspace Module
- Project Config & Build
- Project Config & Build
- Task Done Module
- Task Start Module
- Review Package Module
- Task Brief Module
- Find Polluter.Sh Module
- Bundle Artifact.Sh Module
- Init Artifact.Sh Module
- Project Config & Build

## God Nodes (most connected - your core abstractions)
1. `getAuthenticatedTeamUser()` - 58 edges
2. `react` - 56 edges
3. `createSupabaseServerClient()` - 47 edges
4. `next` - 44 edges
5. `lucide-react` - 33 edges
6. `requireTeamUser()` - 26 edges
7. `useT()` - 25 edges
8. `isSameOriginRequest()` - 23 edges
9. `framer-motion` - 21 edges
10. `getClientAddress()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `AdminLayout()` --calls--> `getAuthenticatedTeamUser()`  [EXTRACTED]
  src/app/admin/layout.tsx → src/lib/auth.ts
- `main()` --calls--> `create_connection()`  [EXTRACTED]
  .agents/skills/mcp-builder/scripts/evaluation.py → .agents/skills/mcp-builder/scripts/connections.py
- `main()` --calls--> `generate_html()`  [EXTRACTED]
  .agents/skills/skill-creator/scripts/run_loop.py → .agents/skills/skill-creator/scripts/generate_report.py
- `run_loop()` --calls--> `generate_html()`  [EXTRACTED]
  .agents/skills/skill-creator/scripts/run_loop.py → .agents/skills/skill-creator/scripts/generate_report.py
- `run_loop()` --calls--> `find_project_root()`  [EXTRACTED]
  .agents/skills/skill-creator/scripts/run_loop.py → .agents/skills/skill-creator/scripts/run_eval.py

## Import Cycles
- None detected.

## Communities (69 total, 15 thin omitted)

### Community 0 - "Auth & Session Management"
Cohesion: 0.09
Nodes (55): next, GET(), GET(), initials(), parseStatus(), PATCH(), POST(), serialize() (+47 more)

### Community 1 - "Auth & Session Management"
Cohesion: 0.06
Nodes (51): stripe, dynamic, WhatsAppPage(), execute(), GET(), POST(), metadataOrganization(), objectOf() (+43 more)

### Community 2 - "Auth & Session Management"
Cohesion: 0.07
Nodes (49): ComercialPage(), dynamic, execute(), GET(), POST(), CommercialWorkspace(), refresh(), run() (+41 more)

### Community 3 - "Auth & Session Management"
Cohesion: 0.08
Nodes (41): GET(), POST(), metricLabels, PerformanceWorkspace(), refresh(), run(), post(), ProgressBar() (+33 more)

### Community 4 - "Auth & Session Management"
Cohesion: 0.06
Nodes (35): ref_node_assert, ref_server_only, awardKeys, cases, deal, ids, paymentCases, performanceCases (+27 more)

### Community 5 - "Auth & Session Management"
Cohesion: 0.08
Nodes (39): execute(), GET(), POST(), InboxWorkspace(), refresh(), run(), send(), post() (+31 more)

### Community 6 - "Vertex Platform & Dashboard"
Cohesion: 0.08
Nodes (24): metadata, HomePlatformHighlight(), Laptop3DShowcase(), DEMO_SITES, SiteDemo, LaptopScreenContent(), LaptopScreenContentProps, NicheItem (+16 more)

### Community 7 - "UI Primitives & Design System"
Cohesion: 0.11
Nodes (25): build_run(), embed_file(), find_runs(), _find_runs_recursive(), generate_html(), get_mime_type(), _kill_port(), load_previous_iteration() (+17 more)

### Community 8 - "UI Primitives & Design System"
Cohesion: 0.09
Nodes (18): CasesIndexClient(), LocalizedCaseStudy, metadata, CaseCard(), CaseCardProps, CasesSection(), ACCENTS, TestimonialsSection() (+10 more)

### Community 9 - "Server.Cjs Module"
Cohesion: 0.08
Nodes (26): brandMarkup(), clients, CONTENT_DIR, crypto, debounceTimers, escapeHtmlText(), frameTemplate, fs (+18 more)

### Community 10 - "Hero & Presentation"
Cohesion: 0.13
Nodes (18): gsap, AboutSection(), CEO_ACCENTS, AILabSection(), generateDemoResponse(), Message, ContactSection(), FAQSection() (+10 more)

### Community 11 - "Tests & Verification"
Cohesion: 0.11
Nodes (23): _call_claude(), improve_description(), main(), Path, Improve a skill description based on eval results. Takes eval results (from…, Run `claude -p` with the prompt on stdin and return the text response. Prompt…, Call Claude to improve the description based on eval results., main() (+15 more)

### Community 12 - "API Routes & Endpoints"
Cohesion: 0.08
Nodes (14): ref_node_child_process, ref_node_crypto, ref_node_fs, api(), emails, env, findUserByEmail(), headers (+6 more)

### Community 13 - "Vertex Platform & Dashboard"
Cohesion: 0.14
Nodes (14): framer-motion, CaseStudyClient(), PageProps, LanguageSwitcher(), ThemeToggle(), PlataformaNav(), CASE_STUDIES, CaseStudyContent (+6 more)

### Community 14 - "Vertex Platform & Dashboard"
Cohesion: 0.15
Nodes (13): react, ClientLandingShellProps, Command, CommandPalette(), CustomCursor(), Footer(), PlataformaClientShellProps, Preloader() (+5 more)

### Community 15 - "Auth & Session Management"
Cohesion: 0.19
Nodes (17): CRMPage(), dynamic, InboxPage(), AdminOverview(), dynamic, dynamic, PerformancePage(), dynamic (+9 more)

### Community 16 - "Admin Backoffice"
Cohesion: 0.13
Nodes (17): CRMTable(), STATUS_OPTIONS, colors, columns, priorityTone, stageToApi, aiLogs, Client (+9 more)

### Community 17 - "Auth & Session Management"
Cohesion: 0.10
Nodes (20): name, private, version, eslint-config-next, @google/generative-ai, lenis, raw-loader, react-dom (+12 more)

### Community 18 - "Auth & Session Management"
Cohesion: 0.14
Nodes (13): AdminLayout(), ActivityItem, AdminShell(), initials(), links, WorkspaceSwitcher(), getConfirmedUser(), getLegacyMember() (+5 more)

### Community 19 - "Auth & Session Management"
Cohesion: 0.11
Nodes (19): dependencies, framer-motion, @google/generative-ai, gsap, @gsap/react, lenis, lucide-react, next (+11 more)

### Community 20 - "Project Config & Build"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "UI Primitives & Design System"
Cohesion: 0.15
Nodes (13): three, SkillsOrbit, CARD_ICONS, ServiceCard(), ServiceCardProps, ServicesSection(), EXPERIENCE, ExperienceEntry (+5 more)

### Community 22 - "UI Primitives & Design System"
Cohesion: 0.15
Nodes (15): main(), package_skill(), Path, Skill Packager - Creates a distributable .skill file of a skill folder Usage:…, Check if a path should be excluded from packaging., Package a skill folder into a .skill file. Args: skill_path: Path to the skill…, should_exclude(), Basic validation of a skill (+7 more)

### Community 23 - "Tests & Verification"
Cohesion: 0.18
Nodes (13): {
BANNED_CONSOLE_METHODS,
DEFAULT_MAX_LINES,
fileName,
isBaselineIgnored,
isCheckableSourceFile,
isTestFile,
}, maxLines, noDirectConsole, noDirectDataAccess, {
maxLines,
noDirectConsole,
noDirectDataAccess,
}, BANNED_CONSOLE_METHODS, eslint_rules_utils_default_max_lines, fileName() (+5 more)

### Community 24 - "Tests & Verification"
Cohesion: 0.16
Nodes (11): dynamic, ProspectingPage(), ProspectingClient(), STATUS_LABEL, STATUS_TONE, AiRunLog, dollars(), listProspects() (+3 more)

### Community 25 - "I18N.Ts Module"
Cohesion: 0.16
Nodes (15): Dict, dictionaries, en, es, fr, getDict(), it, Locale (+7 more)

### Community 26 - "Project Config & Build"
Cohesion: 0.17
Nodes (15): aggregate_results(), calculate_stats(), generate_benchmark(), generate_markdown(), load_run_results(), main(), Path, Aggregate run results into summary statistics. Returns run_summary with stats… (+7 more)

### Community 27 - "Project Config & Build"
Cohesion: 0.13
Nodes (15): devDependencies, eslint, eslint-config-next, @eslint/js, globals, @next/eslint-plugin-next, raw-loader, tailwindcss (+7 more)

### Community 28 - "Lucide React Module"
Cohesion: 0.22
Nodes (12): lucide-react, brl(), dynamic, FinanceiroPage(), brl(), ManualSaleItem, ManualSales(), submit() (+4 more)

### Community 29 - "Auth & Session Management"
Cohesion: 0.21
Nodes (11): AILogsPage(), dynamic, ConfiguracoesPage(), dynamic, ROLE_DESCRIPTION, SectionTitle(), StatusBadge(), getAiLogs() (+3 more)

### Community 30 - "Auth & Session Management"
Cohesion: 0.18
Nodes (14): bootstrapPage(), getNewestScreen(), handleRequest(), isAuthorized(), isFullDocument(), isRegularFileInsideContentDir(), parseCookies(), pathnameOf() (+6 more)

### Community 31 - "Abc Module"
Cohesion: 0.17
Nodes (8): ABC, MCPConnection, MCPConnectionHTTP, MCP connection using Streamable HTTP., Base class for MCP server connections., Create the connection context based on connection type., Initialize MCP server connection., Clean up MCP server connection resources.

### Community 32 - "Broadcast() Module"
Cohesion: 0.18
Nodes (11): broadcast(), computeAcceptKey(), decodeFrame(), encodeFrame(), handleMessage(), handleUpgrade(), isAllowedWebSocketOrigin(), preferredPort() (+3 more)

### Community 33 - "UI Primitives & Design System"
Cohesion: 0.21
Nodes (12): find_project_root(), main(), Path, Run the full eval set and return results., Run trigger evaluation for a skill description. Tests whether a skill's…, Find the project root by walking up from cwd looking for .claude/. Mimics how…, Run a single query and return whether the skill was triggered. Creates a…, run_eval() (+4 more)

### Community 34 - "Tests & Verification"
Cohesion: 0.20
Nodes (11): extract_xml_content(), main(), parse_env_vars(), parse_headers(), MCP Server Evaluation Harness This script evaluates MCP servers by running test…, Parse header strings in format 'Key: Value' into a dictionary., Parse environment variable strings in format 'KEY=VALUE' into a dictionary., Extract content from XML tags. (+3 more)

### Community 35 - "Project Config & Build"
Cohesion: 0.20
Nodes (8): next-themes, src_app_globals, inter, metadata, outfit, ThemeTransition(), ThemeProvider(), ThemeProviderProps

### Community 36 - "Hero & Presentation"
Cohesion: 0.23
Nodes (7): HeroCanvas, HeroSection(), NavLink(), MagneticButton(), MagneticButtonProps, MagneticOptions, useMagneticEffect()

### Community 37 - "Create Connection() Module"
Cohesion: 0.20
Nodes (6): create_connection(), MCPConnectionSSE, MCPConnectionStdio, Factory function to create the appropriate MCP connection. Args: transport:…, MCP connection using standard input/output., MCP connection using Server-Sent Events.

### Community 38 - "Agent Loop() Module"
Cohesion: 0.27
Nodes (11): agent_loop(), evaluate_single_task(), parse_evaluation_file(), Any, Path, Evaluate a single QA pair with the given tools., Run evaluation with MCP server tools., Parse XML evaluation file with qa_pair elements. (+3 more)

### Community 39 - "Auth & Session Management"
Cohesion: 0.29
Nodes (7): @supabase/ssr, ChangePasswordPage(), getSupabaseConfig(), createSupabaseBrowserClient(), isSupabaseConfigured(), config, middleware()

### Community 40 - "Project Config & Build"
Cohesion: 0.20
Nodes (8): nextConfig, ref_fs, ref_path, { execSync }, fs, gitFiles, path, walk()

### Community 41 - "Auth & Session Management"
Cohesion: 0.42
Nodes (7): connect(), nextReconnectDelay(), reloadAfterRecovery(), sessionKey(), setStatus(), showTombstone(), websocketUrl()

### Community 42 - "Vertex Platform & Dashboard"
Cohesion: 0.22
Nodes (9): browserLauncherForPlatform(), chmodOwnerOnly(), companionUrl(), generateToken(), initialToken(), maybeOpenBrowser(), onListen(), urlHostForHttp() (+1 more)

### Community 43 - "Generate Report.Py Module"
Cohesion: 0.25
Nodes (6): generate_html(), main(), Generate HTML report from loop output data. If auto_refresh is True, adds a…, Generate an HTML report from run_loop.py output. Takes the JSON output from…, html, json

### Community 44 - "Connections.Py Module"
Cohesion: 0.25
Nodes (7): Lightweight connection handling for MCP servers., contextlib, mcp, mcp_client_sse, mcp_client_stdio, mcp_client_streamable_http, typing

### Community 45 - "With Server.Py Module"
Cohesion: 0.29
Nodes (7): is_server_ready(), main(), Start one or more servers, wait for them to be ready, run a command, then clean…, Wait for server to be ready by polling the port., argparse, socket, time

### Community 46 - "UI Primitives & Design System"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, lint:fix, lint:types, start, test:commercial

### Community 47 - "Stop Server.Sh Module"
Cohesion: 0.52
Nodes (6): command_has_server_id(), command_line_for_pid(), is_brainstorm_server(), mark_stopped(), read_expected_server_id(), stop-server.sh script

### Community 48 - "Project Config & Build"
Cohesion: 0.29
Nodes (5): eslint, @eslint/js, globals, @next/eslint-plugin-next, typescript-eslint

### Community 50 - "Render Graphs.Js Module"
Cohesion: 0.60
Nodes (5): combineGraphs(), extractDotBlocks(), extractGraphBody(), main(), renderToSvg()

### Community 51 - "Animation & Smooth Scroll"
Cohesion: 0.40
Nodes (3): @gsap/react, RevealProps, MotionTokens

### Community 52 - "Stripe.Ts Module"
Cohesion: 0.53
Nodes (5): brl(), FinanceData, getFinanceData(), getManualSalesData(), getStripeClient()

### Community 53 - ".Call Tool() Module"
Cohesion: 0.40
Nodes (3): Any, Retrieve available tools from the MCP server., Call a tool on the MCP server with provided arguments.

### Community 55 - "Shaders.D.Ts Module"
Cohesion: 0.50
Nodes (3): *.frag, *.glsl, *.vert

## Knowledge Gaps
- **262 isolated node(s):** `crypto`, `http`, `fs`, `path`, `OPCODES` (+257 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 454 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Auth & Session Management` to `Auth & Session Management`, `Auth & Session Management`, `Auth & Session Management`, `Auth & Session Management`, `Auth & Session Management`, `Vertex Platform & Dashboard`, `UI Primitives & Design System`, `Hero & Presentation`, `Vertex Platform & Dashboard`, `Vertex Platform & Dashboard`, `Auth & Session Management`, `Admin Backoffice`, `Auth & Session Management`, `Auth & Session Management`, `Lucide React Module`, `Auth & Session Management`, `Project Config & Build`, `Hero & Presentation`, `Auth & Session Management`, `Project Config & Build`?**
  _High betweenness centrality (0.274) - this node is a cross-community bridge._
- **Why does `react` connect `Vertex Platform & Dashboard` to `Auth & Session Management`, `Auth & Session Management`, `Auth & Session Management`, `Auth & Session Management`, `Auth & Session Management`, `Auth & Session Management`, `Vertex Platform & Dashboard`, `UI Primitives & Design System`, `Hero & Presentation`, `Vertex Platform & Dashboard`, `Admin Backoffice`, `Auth & Session Management`, `Auth & Session Management`, `UI Primitives & Design System`, `Tests & Verification`, `I18N.Ts Module`, `Lucide React Module`, `Project Config & Build`, `Hero & Presentation`, `Auth & Session Management`, `Animation & Smooth Scroll`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `Lucide React Module` to `Auth & Session Management`, `Auth & Session Management`, `Auth & Session Management`, `Auth & Session Management`, `Auth & Session Management`, `Auth & Session Management`, `Vertex Platform & Dashboard`, `Auth & Session Management`, `UI Primitives & Design System`, `Vertex Platform & Dashboard`, `Vertex Platform & Dashboard`, `Auth & Session Management`, `Admin Backoffice`, `Auth & Session Management`, `Auth & Session Management`, `Tests & Verification`, `Auth & Session Management`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `crypto`, `http`, `fs` to the rest of the system?**
  _262 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth & Session Management` be split into smaller, more focused modules?**
  _Cohesion score 0.09134808853118712 - nodes in this community are weakly interconnected._
- **Should `Auth & Session Management` be split into smaller, more focused modules?**
  _Cohesion score 0.05501165501165501 - nodes in this community are weakly interconnected._
- **Should `Auth & Session Management` be split into smaller, more focused modules?**
  _Cohesion score 0.07247223845704266 - nodes in this community are weakly interconnected._