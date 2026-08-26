import { AssessmentModel } from "@/types/assessment";

export const assessmentTemplate: AssessmentModel = {
  title: "SWE Best Practices Pulse",
  description:
    "A 15-question self-diagnostic about the evidence behind how you work on tickets, PRs, tests, docs, and production handoffs. Answer based on what you personally do today, not what your team intends to do.",
  scaleLabel:
    "1 = little or no repeatable evidence · 2 = informal or inconsistent evidence · 3 = repeatable evidence in my work · 4 = repeatable evidence that I review, improve, and share with others",
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
            1: "I start coding from the message or ticket as it was written.",
            2: "I add a short note or ask one question, and the success criteria stay loose.",
            3: "I write clear acceptance criteria before coding, even for normal-sized tasks.",
            4: "I confirm the criteria with the requester, note open questions, and make sure the work is testable before I start.",
          },
        },
        {
          id: "p1-q2",
          text: "Before changing code, how do you check what else might be affected?",
          hint: {
            1: "Impact shows up later, through failing tests, QA, or reviewer comments.",
            2: "I search the repo for related files, without writing down what I found.",
            3: "I note the likely impacted files, flows, or services before coding.",
            4: "I also check with owners of risky areas and update the impact note when the scope changes.",
          },
        },
        {
          id: "p1-q3",
          text: "After finishing a ticket, how do you review how the work went?",
          hint: {
            1: "I move to the next task and revisit it only if something breaks.",
            2: "I notice when a ticket took longer than expected, without a recorded reason.",
            3: "I look at review comments, rework, and time spent to plan better next time.",
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
            "Before coding, add a short Why / What / Done block to the ticket and write the acceptance criteria yourself, then confirm assumptions with the requester. An AI assistant can draft a first pass faster if you want to use one.",
        },
        {
          id: "p1-r2",
          band: "disciplined",
          title: "Make acceptance criteria testable",
          action:
            "Write one Given/When/Then scenario per behavior and add a short impact note. Each scenario should map to a test, manual check, or explicit open question.",
        },
        {
          id: "p1-r3",
          band: "optimized",
          title: "Turn messy input into a clear spec",
          action:
            "Turn Slack threads or vague tickets into a spec with facts, assumptions, risks, and open questions, then review it yourself before implementation. An AI assistant can speed up the first draft if useful.",
        },
        {
          id: "p1-r4",
          band: "strategic",
          title: "Share a better ticket habit",
          action:
            "Create a lightweight Jira, Linear, or Confluence template for context, acceptance criteria, assumptions, risks, and verification. Have a teammate try it and improve it from feedback.",
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
          id: "p2-q1",
          text: "Before building something, how do you look for existing code or patterns to reuse?",
          hint: {
            1: "I build the solution from scratch.",
            2: "I search the repo for similar files or components, as a quick, informal check.",
            3: "I check existing code, docs, ADRs, or shared patterns and mention what I reused in my plan or PR.",
            4: "When I find a useful or confusing pattern, I improve the docs or share it so others can reuse it too.",
          },
        },
        {
          id: "p2-q2",
          text: "For non-trivial work, how do you explain your technical approach before coding?",
          hint: {
            1: "The plan stays in my head and I start coding.",
            2: "I write a few notes for myself that are not easy for others to review.",
            3: "I write a short design note or diagram and share it before implementing risky or cross-cutting changes.",
            4: "I get feedback from the right people, update the note when the design changes, and link it from the ticket or PR.",
          },
        },
        {
          id: "p2-q3",
          text: "When your change touches user data, auth, payments, or external input, how do you think about security?",
          hint: {
            1: "I rely on the framework or existing code to handle it.",
            2: "I avoid obvious mistakes like hardcoded secrets, without a focused security pass.",
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
            "Search the repo for similar files, components, or docs before designing. Note one pattern you reused or intentionally rejected in the ticket or PR.",
        },
        {
          id: "p2-r2",
          band: "disciplined",
          title: "Write a small design note",
          action:
            "For risky or cross-cutting work, write a one-page design note with context, decision, tradeoffs, risks, and open questions before coding.",
        },
        {
          id: "p2-r3",
          band: "optimized",
          title: "Stress-test your design before you build",
          action:
            "Review your design for unclear boundaries, security risks, data gaps, failure modes, and missing tests, then turn accepted findings into mitigations or non-goals. An AI assistant can help you run a faster first pass.",
        },
        {
          id: "p2-r4",
          band: "strategic",
          title: "Turn good design notes into a team habit",
          action:
            "Create a practical ADR template for the team with context, options, decision, risks, security, observability, tests, and rollout notes.",
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
          id: "p3-q1",
          text: "Before you request review or merge, how do you make sure the PR is easy to review and matches the ticket?",
          hint: {
            1: "I open the PR once it works, and review is left to catch scope or coverage gaps.",
            2: "I keep most of the work in one PR and manually test the main flow, without mapping each acceptance criterion.",
            3: "I split refactors, behavior changes, tests, and docs when useful, and map each acceptance criterion to code, tests, or manual verification before merging.",
            4: "I plan the PR sequence early, put the acceptance-criteria mapping in the PR description, and use reviewer feedback to improve how I split future work.",
          },
        },
        {
          id: "p3-q2",
          text: "When your change affects how someone uses, runs, or supports the system, when do you update docs?",
          hint: {
            1: "Docs updates wait until later.",
            2: "I update docs when someone asks, or after I remember once the code is done.",
            3: "I update docs in the same PR as the code change.",
            4: "I re-read the docs from a new engineer's point of view and fix gaps after the change lands.",
          },
        },
        {
          id: "p3-q3",
          text: "When your code accepts or saves data, how do you prevent bad data from getting through?",
          hint: {
            1: "I assume the caller sends valid data.",
            2: "I validate obvious inputs, and deeper constraints or multi-step consistency stay inconsistent.",
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
            "Keep your next PR focused on one concern. Add a short note that says what is included, what is out of scope, and which test protects it.",
        },
        {
          id: "p3-r2",
          band: "disciplined",
          title: "Map the ticket to the PR",
          action:
            "Before review, map each acceptance criterion to code, tests, docs, or manual verification. Make missing evidence explicit instead of leaving reviewers to find it.",
        },
        {
          id: "p3-r3",
          band: "optimized",
          title: "Run a PR readiness check",
          action:
            "Before requesting human review, check your PR for blockers around scope, acceptance criteria, tests, docs, data integrity, and rollback notes. An AI assistant can help you run this check faster if you use one.",
        },
        {
          id: "p3-r4",
          band: "strategic",
          title: "Create a reusable PR checklist",
          action:
            "Create a lightweight PR template covering summary, acceptance criteria, tests run, docs changed, risks, rollback, and review notes.",
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
          id: "p4-q1",
          text: "When you write tests, how much do you cover beyond the happy path?",
          hint: {
            1: "I rely on manual checks or the main demo flow.",
            2: "I test the main success path, and edge cases and failures are hit or miss.",
            3: "I cover at least one edge case and one failure path for meaningful logic.",
            4: "I list the highest-risk failure modes first and update my test approach when bugs or incidents teach us something.",
          },
        },
        {
          id: "p4-q2",
          text: "Before asking for review, how carefully do you review your own diff?",
          hint: {
            1: "I open the PR once it works and CI is green.",
            2: "I skim the diff for obvious mistakes before tagging reviewers.",
            3: "I review the diff against the ticket, tests, and risky branches before requesting review.",
            4: "I tell reviewers which parts are risky and what I already checked.",
          },
        },
        {
          id: "p4-q3",
          text: "When you touch an area with flaky tests or old test debt, what do you do?",
          hint: {
            1: "I work around broken tests if they block the task.",
            2: "I fix tests my change directly broke, and older issues stay untouched.",
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
            "Add one edge-case or failure-path test to your next change, not only the happy path. Start with the bug a user would most likely notice.",
        },
        {
          id: "p4-r2",
          band: "disciplined",
          title: "Review your diff before others do",
          action:
            "Self-review the riskiest part of your diff before tagging reviewers. Name that risk and what you checked in the PR description.",
        },
        {
          id: "p4-r3",
          band: "optimized",
          title: "Find the tests you missed",
          action:
            "Look for missing tests around invalid input, boundary values, partial failure, repeated actions, and regressions, then keep only the ones that match real product rules. An AI assistant can help you brainstorm gaps faster.",
        },
        {
          id: "p4-r4",
          band: "strategic",
          title: "Turn bug patterns into shared checks",
          action:
            "Turn recurring bugs or review comments into a small team checklist with examples, test patterns, and CI guardrails.",
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
          id: "p5-q1",
          text: "After your feature ships, how easy is it to know whether it is working?",
          hint: {
            1: "I rely on generic errors, user reports, or someone manually checking.",
            2: "I add basic logs that are not always searchable or tied to clear success/failure signals.",
            3: "I add useful logs, metrics, dashboards, or alerts for the feature before release.",
            4: "I verify the signals after deploy and document what to check first when something looks wrong.",
          },
        },
        {
          id: "p5-q2",
          text: "If you are offline, how easily can another engineer understand or support your change?",
          hint: {
            1: "Most of the context stays in my head or scattered in chats.",
            2: "The PR explains the change, and the context is hard to find after merge.",
            3: "I leave a README, runbook, Confluence note, or architecture note linked from the repo or ticket.",
            4: "I keep the handoff material current and review it with people who may support the feature.",
          },
        },
        {
          id: "p5-q3",
          text: "How do you treat CI checks and pipeline health when your PR is ready to merge?",
          hint: {
            1: "I rely mostly on local checks or manual deploy habits.",
            2: "I wait for basic CI, and sometimes rerun or ignore failures without digging deeper.",
            3: "I make sure required checks pass and understand what they cover before merging.",
            4: "When CI fails, I look for the root cause and improve the pipeline when I find a real gap.",
          },
        },
      ],
      recommendations: [
        {
          id: "p5-r1",
          band: "foundational",
          title: "Add signals someone can search",
          action:
            "Add one searchable signal for your next feature: a structured log, metric, dashboard, or alert that answers a real support question.",
        },
        {
          id: "p5-r2",
          band: "disciplined",
          title: "Leave a handoff note",
          action:
            "Write the minimum handoff another engineer needs: what changed, how to verify it, signals to watch, first debugging steps, rollback or mitigation, and owner.",
        },
        {
          id: "p5-r3",
          band: "optimized",
          title: "Draft a runbook from your PR context",
          action:
            "Draft a runbook from your PR context covering links, dashboards, commands, owners, and rollback steps, then verify every item before sharing it. An AI assistant can speed up the first draft if you use one.",
        },
        {
          id: "p5-r4",
          band: "strategic",
          title: "Create a team handoff standard",
          action:
            "Create a lightweight runbook template for new features with required signals, first-response steps, rollback, ownership, and links.",
        },
      ],
    },
  ],
};
