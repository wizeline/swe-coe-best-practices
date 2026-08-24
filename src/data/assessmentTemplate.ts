import { AssessmentModel } from "@/types/assessment";

export const assessmentTemplate: AssessmentModel = {
  title: "SWE Best Practices Pulse",
  description:
    "A 16-question self-diagnostic about how you usually work on tickets, PRs, tests, docs, and production handoffs. Answer based on what you personally do today, not what your team intends to do.",
  scaleLabel:
    "1 = I rarely do this · 2 = I do this sometimes · 3 = I do this consistently · 4 = I do this consistently and help improve the habit for others",
  categories: [
    {
      id: "pillar-1-ideation",
      title: "Pillar 1 – Ideation & Requirements",
      description:
        "How you turn a request into clear work before you start coding.",
      weight: 0.2,
      questions: [
        {
          id: "p1-q1",
          text: "When you get a new ticket or Slack request, how do you clarify what needs to be built?",
          hint: {
            1: "I usually start coding from the message or ticket as-is.",
            2: "I add a short note or ask a quick question, but the success criteria are still loose.",
            3: "I write clear acceptance criteria before coding, even for normal-sized tasks.",
            4: "I confirm the criteria with the requester, call out open questions, and make sure the work is testable before I start.",
          },
        },
        {
          id: "p1-q2",
          text: "Before changing code, how do you check what else might be affected?",
          hint: {
            1: "I mostly find out when tests fail, QA reports something, or a reviewer points it out.",
            2: "I search the repo for related files, but I do not write down what I found.",
            3: "I note the likely impacted files, flows, or services in the ticket or PR before coding.",
            4: "I also check with owners of risky areas and update the impact note when the scope changes.",
          },
        },
        {
          id: "p1-q3",
          text: "After finishing work, how do you learn from how the ticket went?",
          hint: {
            1: "I move to the next task and do not look back unless something breaks.",
            2: "I notice when a ticket took longer than expected, but I do not track why.",
            3: "I look at review comments, rework, and time spent so I can estimate or plan better next time.",
            4: "I pick one recurring bottleneck each sprint and try a specific change to improve it.",
          },
        },
      ],
      recommendations: [
        {
          id: "p1-r1",
          band: "foundational",
          title: "Turn rough requests into clear tickets",
          action:
            "Do: Add a short Why / What / Done block before coding. Prompt: 'Act as a senior product engineer. Convert this request into a concise ticket. Use only the provided context, mark assumptions, list open questions, and write testable acceptance criteria.' Output: ticket draft. Check: every Done item can be observed in the app, API, logs, or tests.",
        },
        {
          id: "p1-r2",
          band: "disciplined",
          title: "Make acceptance criteria testable",
          action:
            "Do: Write one scenario per behavior and note the likely impacted files. Prompt: 'Act as a senior QA-minded engineer. Convert this ticket into Given/When/Then scenarios. Do not invent requirements; put missing details under Open Questions. Also list files or flows likely affected.' Output: scenarios plus impact note. Check: each scenario maps to a planned automated or manual check.",
        },
        {
          id: "p1-r3",
          band: "optimized",
          title: "Use AI to clean up messy input",
          action:
            "Do: Use an assistant to turn Slack threads, notes, or vague tickets into a reviewed spec. Prompt: 'Act as a senior engineer preparing implementation. Summarize the request, separate facts from assumptions, write acceptance criteria, non-goals, dependencies, risks, and questions. Do not fill gaps silently.' Output: reviewed spec. Check: confirm assumptions with the requester before implementation.",
        },
        {
          id: "p1-r4",
          band: "strategic",
          title: "Share a better ticket habit",
          action:
            "Do: Turn your ticket cleanup process into a team template. Prompt: 'Act as an engineering lead. Create a lightweight ticket template for Jira or Linear with sections for context, acceptance criteria, assumptions, risks, and verification. Include guidance for when to ask follow-up questions.' Output: shared template or Confluence note. Check: at least one teammate uses it and gives feedback.",
        },
      ],
    },
    {
      id: "pillar-2-design",
      title: "Pillar 2 – Design & Architecture",
      description:
        "How you choose an approach before changing code.",
      weight: 0.2,
      questions: [
        {
          id: "p2-q4",
          text: "Before building something, how do you look for existing code or patterns to reuse?",
          hint: {
            1: "I usually build the solution from scratch.",
            2: "I search the repo for similar files or components, but the check is quick and informal.",
            3: "I check existing code, docs, ADRs, or shared patterns and mention what I reused in my plan or PR.",
            4: "When I find a useful or confusing pattern, I improve the docs or share it so others can reuse it too.",
          },
        },
        {
          id: "p2-q5",
          text: "For non-trivial work, how do you explain your technical approach before coding?",
          hint: {
            1: "I keep the plan in my head and start coding.",
            2: "I write a few notes for myself, but they are not easy for others to review.",
            3: "I write a short design note or diagram and share it before implementing risky or cross-cutting changes.",
            4: "I get feedback from the right people, update the note when the design changes, and link it from the ticket or PR.",
          },
        },
        {
          id: "p2-q6",
          text: "When your change touches user data, auth, payments, or external input, how do you think about security?",
          hint: {
            1: "I rely on the framework or existing code to handle it.",
            2: "I avoid obvious mistakes like hardcoded secrets, but I do not do a focused security pass.",
            3: "I trace the data flow, name at least one realistic risk, and plan the mitigation before coding.",
            4: "I ask for review on the risk and verify the mitigation in code review or tests.",
          },
        },
      ],
      recommendations: [
        {
          id: "p2-r1",
          band: "foundational",
          title: "Look before building from scratch",
          action:
            "Do: Search for similar code and write down what you found. Prompt: 'Act as a senior engineer joining this repo. Given this task and file list, identify existing modules, patterns, or docs I should inspect before designing the solution. Mark uncertain guesses.' Output: reuse checklist. Check: your ticket or PR names at least one reused or intentionally rejected pattern.",
        },
        {
          id: "p2-r2",
          band: "disciplined",
          title: "Write a small design note",
          action:
            "Do: Write a short design note before coding risky work. Prompt: 'Act as a senior engineer reviewing a design. Draft a one-page ADR with context, decision, alternatives, tradeoffs, data flow, security concern, rollout, and open questions. Do not assume missing facts.' Output: ADR or design note. Check: a reviewer can understand the approach before reading the diff.",
        },
        {
          id: "p2-r3",
          band: "optimized",
          title: "Use AI to challenge the design",
          action:
            "Do: Ask an assistant to find holes before the PR exists. Prompt: 'Act as a skeptical staff engineer. Review this design for unclear boundaries, security risks, data integrity gaps, failure modes, simpler alternatives, and missing tests. Separate facts, assumptions, and questions.' Output: design review checklist. Check: every accepted risk has a mitigation, owner, or explicit non-goal.",
        },
        {
          id: "p2-r4",
          band: "strategic",
          title: "Turn good design notes into a team habit",
          action:
            "Do: Share a template that makes design review easier. Prompt: 'Act as an engineering lead. Create a practical ADR template for our team with sections for context, options, decision, risks, security, observability, tests, rollout, and human review of AI suggestions.' Output: team ADR template. Check: new design notes use the template consistently.",
        },
      ],
    },
    {
      id: "pillar-3-development",
      title: "Pillar 3 – Development Hygiene",
      description:
        "How you keep PRs reviewable, verified, and easy to maintain.",
      weight: 0.2,
      questions: [
        {
          id: "p3-q7",
          text: "When a task grows, how do you keep the PR easy to review?",
          hint: {
            1: "I usually keep everything in one PR once I have started.",
            2: "I try to stay focused, but refactors, fixes, and feature work often end up together.",
            3: "I split refactors, behavior changes, tests, and docs when that makes review easier.",
            4: "I plan the PR sequence early and use reviewer feedback to improve how I split future work.",
          },
        },
        {
          id: "p3-q8",
          text: "Before opening or merging a PR, how do you check that it actually covers the ticket?",
          hint: {
            1: "I trust my implementation and expect review to catch mismatches.",
            2: "I manually test the main flow, but I do not check each acceptance criterion one by one.",
            3: "I map each acceptance criterion to code, tests, or manual verification before merging.",
            4: "I put that mapping in the PR so reviewers can verify coverage quickly.",
          },
        },
        {
          id: "p3-q9",
          text: "When your change affects how someone uses, runs, or supports the system, when do you update docs?",
          hint: {
            1: "I usually leave docs for later.",
            2: "I update docs when someone asks or when I remember after the code is done.",
            3: "I update docs in the same PR as the code change.",
            4: "I re-read the docs from a new engineer's point of view and fix gaps after the change lands.",
          },
        },
        {
          id: "p2-q15",
          text: "How do you treat CI when your PR is ready?",
          hint: {
            1: "I rely mostly on local checks or manual deploy habits.",
            2: "I wait for basic CI, but I sometimes rerun or ignore failures without digging deeply.",
            3: "I make sure required checks pass and understand what they cover before merging.",
            4: "When CI fails, I look for root cause and improve the pipeline when I find a real gap.",
          },
        },
        {
          id: "p2-q16",
          text: "When your code accepts or saves data, how do you prevent bad data from getting through?",
          hint: {
            1: "I mostly assume the caller sends valid data.",
            2: "I validate obvious inputs, but deeper constraints or multi-step consistency are inconsistent.",
            3: "I validate inputs, enforce constraints where data is stored, and use transactions or equivalent safeguards when needed.",
            4: "I also test and document the data guarantees my code provides and what it expects from callers.",
          },
        },
      ],
      recommendations: [
        {
          id: "p3-r1",
          band: "foundational",
          title: "Make the next PR smaller and safer",
          action:
            "Do: Keep the next PR to one concern and add one guardrail. Prompt: 'Act as a senior engineer. Split this task into the smallest reviewable PRs. For each PR, list goal, files, tests, docs, risks, and what is out of scope. Do not add unrelated cleanup.' Output: PR plan. Check: the PR description clearly says what is included and excluded.",
        },
        {
          id: "p3-r2",
          band: "disciplined",
          title: "Map the ticket to the PR",
          action:
            "Do: Show how the implementation covers the ticket. Prompt: 'Act as a careful reviewer. Compare this ticket and PR plan. Create a traceability table with acceptance criteria, code areas, tests, docs, and missing evidence. Mark anything uncertain.' Output: traceability table. Check: each acceptance criterion has evidence or an explicit follow-up.",
        },
        {
          id: "p3-r3",
          band: "optimized",
          title: "Use AI for PR readiness checks",
          action:
            "Do: Ask an assistant to review readiness before humans spend time on the PR. Prompt: 'Act as a strict PR reviewer. Given this diff, ticket, and test output, find scope creep, missing acceptance criteria, weak tests, docs gaps, data integrity risks, and unclear rollback notes. Separate blockers from suggestions.' Output: PR readiness checklist. Check: fix blockers before requesting review.",
        },
        {
          id: "p3-r4",
          band: "strategic",
          title: "Create a reusable PR checklist",
          action:
            "Do: Turn your PR habits into a team checklist. Prompt: 'Act as an engineering lead. Create a practical PR template with sections for summary, acceptance criteria coverage, tests run, docs changed, risks, rollback, and AI-assisted review notes. Keep it lightweight.' Output: PR template. Check: the team uses it for at least one feature cycle.",
        },
      ],
    },
    {
      id: "pillar-4-quality",
      title: "Pillar 4 – Quality Engineering",
      description: "How you catch bugs before users or teammates do.",
      weight: 0.2,
      questions: [
        {
          id: "p4-q10",
          text: "When you write tests, how much do you cover beyond the happy path?",
          hint: {
            1: "I mostly rely on manual checks or the main demo flow.",
            2: "I test the main success path, but edge cases and failures are hit or miss.",
            3: "I usually cover at least one edge case and one failure path for meaningful logic.",
            4: "I list the highest-risk failure modes first and update my test approach when bugs or incidents teach us something.",
          },
        },
        {
          id: "p4-q11",
          text: "Before asking for review, how carefully do you review your own diff?",
          hint: {
            1: "I open the PR once it works and CI is green.",
            2: "I skim the diff for obvious mistakes before tagging reviewers.",
            3: "I review the diff against the ticket, tests, and risky branches before requesting review.",
            4: "I tell reviewers which parts are risky and what I already checked.",
          },
        },
        {
          id: "p4-q12",
          text: "When you touch an area with flaky tests or old test debt, what do you do?",
          hint: {
            1: "I work around broken tests if they block the task.",
            2: "I fix tests my change directly broke, but I usually leave older issues alone.",
            3: "I clean up outdated or flaky tests in the area I am already touching when the scope is reasonable.",
            4: "I track recurring test debt, propose cleanup, and improve the area over time.",
          },
        },
      ],
      recommendations: [
        {
          id: "p4-r1",
          band: "foundational",
          title: "Add one test that can fail for a real reason",
          action:
            "Do: Add one edge-case or failure-path test, not only the demo path. Prompt: 'Act as a senior test engineer. For this function or feature, list the happy path, likely edge cases, realistic failure modes, and the single highest-value test to add first. Do not invent product rules.' Output: focused test plan. Check: at least one negative or boundary case is automated.",
        },
        {
          id: "p4-r2",
          band: "disciplined",
          title: "Review your diff before others do",
          action:
            "Do: Self-review the risky parts before requesting review. Prompt: 'Act as a strict reviewer. Audit this diff against the ticket and tests. Identify logic gaps, weak assertions, flaky test risks, missing edge cases, and one small cleanup worth doing now. Separate blockers from nice-to-haves.' Output: self-review note. Check: the PR description names the riskiest area and what you checked.",
        },
        {
          id: "p4-r3",
          band: "optimized",
          title: "Use AI to find tests you missed",
          action:
            "Do: Use an assistant to expand your test thinking, then choose tests yourself. Prompt: 'Act as a QA strategist. Given this code, ticket, and known constraints, propose tests for invalid input, boundary values, partial failure, concurrency or repeated actions, and regression risk. Rank by user impact and mark assumptions.' Output: prioritized test list. Check: merged tests match real behavior, not invented rules.",
        },
        {
          id: "p4-r4",
          band: "strategic",
          title: "Turn bug patterns into shared checks",
          action:
            "Do: Convert repeated bugs into a checklist your team can use. Prompt: 'Act as an engineering lead. Analyze these recent bugs or review comments and create a lightweight quality checklist with examples, test patterns, CI guardrails, and when to apply each item.' Output: team quality checklist. Check: the checklist catches or prevents a recurring issue.",
        },
      ],
    },
    {
      id: "pillar-5-operations",
      title: "Pillar 5 – Operations & Maintenance",
      description: "How easy it is for you or someone else to debug and support what you ship.",
      weight: 0.2,
      questions: [
        {
          id: "p5-q13",
          text: "After your feature ships, how easy is it to know whether it is working?",
          hint: {
            1: "I rely on generic errors, user reports, or someone manually checking.",
            2: "I add basic logs, but they are not always searchable or tied to clear success/failure signals.",
            3: "I add useful logs, metrics, dashboards, or alerts for the feature before release.",
            4: "I verify the signals after deploy and document what to check first when something looks wrong.",
          },
        },
        {
          id: "p5-q14",
          text: "If you are offline, how easily can another engineer understand or support your change?",
          hint: {
            1: "Most of the context is in my head or scattered in chats.",
            2: "The PR explains the change, but the context is hard to find after merge.",
            3: "I leave a README, runbook, Confluence note, or architecture note linked from the repo or ticket.",
            4: "I keep the handoff material current and review it with people who may support the feature.",
          },
        },
      ],
      recommendations: [
        {
          id: "p5-r1",
          band: "foundational",
          title: "Add signals someone can search",
          action:
            "Do: Add at least one searchable signal for the feature. Prompt: 'Act as an on-call engineer. For this feature, list the first three questions support would ask if it breaks. Propose logs, metrics, or alerts that answer those questions. Include event names and fields; mark assumptions.' Output: logging and metrics note. Check: each signal can be found in the real logging or monitoring tool.",
        },
        {
          id: "p5-r2",
          band: "disciplined",
          title: "Leave a handoff note",
          action:
            "Do: Write the minimum context another engineer needs. Prompt: 'Act as a senior engineer writing a handoff note. Draft sections for what changed, how to verify it, signals to watch, likely failure symptoms, first debugging steps, rollback or mitigation, owner, and links. Do not invent links or dashboards.' Output: README, runbook, or Confluence note. Check: another engineer can find it without asking you.",
        },
        {
          id: "p5-r3",
          band: "optimized",
          title: "Use AI to draft support docs",
          action:
            "Do: Use an assistant to turn PR context into support-ready docs. Prompt: 'Act as an on-call-ready engineer. From this PR summary, diff, and known monitoring links, draft a runbook with signals, common failures, triage steps, mitigation, rollback, and ownership. Mark every claim that needs verification.' Output: reviewed runbook. Check: all links, dashboards, commands, and rollback steps are real.",
        },
        {
          id: "p5-r4",
          band: "strategic",
          title: "Create a team handoff standard",
          action:
            "Do: Make handoff notes a normal part of delivery. Prompt: 'Act as an engineering lead. Create a lightweight runbook template for new features with required signals, first-response steps, rollback, ownership, links, and rules for reviewing AI-generated drafts.' Output: shared runbook template in Confluence or the repo. Check: every new feature links to a support note.",
        },
      ],
    },
  ],
};
