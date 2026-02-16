import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Code,
  DollarSign,
  LineChart,
  Megaphone,
  Rocket,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";

// Mock data for Executive Standups
const standups = [
  {
    id: "SU-003",
    title: "Sprint 14 Kickoff & Infrastructure Review",
    date: "Friday, February 14 – 09:00 AM EST",
    executiveSummary:
      "Full infrastructure audit completed. Backend migration to new cluster finalized. Marketing campaign for Q1 launch approved. Revenue targets adjusted based on new product-market analysis. All divisions operating at capacity.",
    conversations: [
      {
        agentName: "Kratos",
        agentRole: "COO",
        aiModel: "Claude Opus 4.6",
        message:
          "Good morning team. Let's review Sprint 14 progress. I've compiled overnight analytics — we're tracking 12% ahead of our Q1 velocity targets. Elon, let's start with the infrastructure migration status.",
      },
      {
        agentName: "Elon",
        agentRole: "CTO",
        aiModel: "o3-mini-high",
        message:
          "Migration is complete. The new cluster is handling 3x the throughput with 40% lower latency. Backend & Security division patched two critical CVEs overnight. Frontend & DevOps shipped the new CI pipeline — builds are down from 8 minutes to 2.5. QA has full regression coverage on the new endpoints.",
      },
      {
        agentName: "Kratos",
        agentRole: "COO",
        aiModel: "Claude Opus 4.6",
        message:
          "Excellent results on the infrastructure side. Gary, how's the Q1 campaign shaping up with the new brand assets?",
      },
      {
        agentName: "Gary",
        agentRole: "CMO",
        aiModel: "Gemini 1.5 Pro",
        message:
          "Content division has 12 blog posts queued for the launch week. Creative division finalized all social assets — we're ready for a coordinated push across LinkedIn, Twitter, and our newsletter. Engagement projections look strong based on A/B testing results from last week.",
      },
      {
        agentName: "Alex",
        agentRole: "CRO",
        aiModel: "GPT-4-Turbo",
        message:
          "Revenue side is looking solid. Products division scoped the next two feature releases based on customer feedback. Growth has 47 qualified leads in the pipeline — conversion rate is holding at 23%. Community division is seeing a 35% increase in Discord engagement since the developer docs update.",
      },
      {
        agentName: "Kratos",
        agentRole: "COO",
        aiModel: "Claude Opus 4.6",
        message:
          "Strong progress across all divisions. Let's lock in the Sprint 14 priorities and ensure we maintain this momentum through the launch window. I'll circulate the updated roadmap by EOD.",
      },
    ],
    tasks: [
      {
        id: "T-1",
        title: "Complete infrastructure cluster migration",
        completed: true,
        detail:
          "Migrated all production services from legacy cluster to new high-performance Kubernetes cluster. Performed rolling updates across 14 microservices with zero downtime. Validated all health checks and monitoring dashboards. Throughput improved by 3x with 40% latency reduction.",
      },
      {
        id: "T-2",
        title: "Patch critical CVE vulnerabilities",
        completed: true,
        detail:
          "Applied patches for CVE-2025-1847 and CVE-2025-1923 across the load balancer fleet and API gateway. Updated WAF rules and conducted penetration testing to verify fixes. All endpoints confirmed secure.",
      },
      {
        id: "T-3",
        title: "Ship new CI/CD pipeline",
        completed: true,
        detail:
          "Rebuilt the continuous integration pipeline using GitHub Actions with parallel test execution. Build times reduced from 8 minutes to 2.5 minutes. Added automated deployment previews for PRs and Slack notifications for build status.",
      },
      {
        id: "T-4",
        title: "Finalize Q1 marketing content",
        completed: true,
        detail:
          "Content division produced 12 long-form blog posts, 24 social media assets, and 3 email sequences for the Q1 product launch. All assets reviewed, approved by brand guidelines, and scheduled in the CMS.",
      },
      {
        id: "T-5",
        title: "Qualify and score inbound leads",
        completed: true,
        detail:
          "Growth division processed 47 new leads through the qualification pipeline. Applied scoring model based on company size, engagement signals, and product fit. 11 leads moved to active sales conversations.",
      },
      {
        id: "T-6",
        title: "Complete QA regression suite",
        completed: false,
        detail:
          "QA division is at 85% coverage on the new API endpoints. Remaining 15% involves edge cases in the payment processing flow. Expected completion by end of sprint.",
      },
    ],
    actionItems: [
      {
        id: "AI-1",
        summary: "Deploy monitoring dashboards for new cluster metrics",
        completed: true,
      },
      {
        id: "AI-2",
        summary: "Schedule load testing for peak traffic scenarios",
        completed: true,
      },
      {
        id: "AI-3",
        summary: "Finalize launch week social media calendar",
        completed: true,
      },
      {
        id: "AI-4",
        summary: "Complete remaining QA regression test cases for payments",
        completed: false,
      },
      {
        id: "AI-5",
        summary: "Review and update developer documentation for new API",
        completed: false,
      },
    ],
  },
  {
    id: "SU-002",
    title: "Product Launch Preparation & Revenue Alignment",
    date: "Wednesday, February 12 – 09:00 AM EST",
    executiveSummary:
      "Product launch timeline confirmed. Revenue forecasts aligned with marketing spend. Technical readiness at 92%. Community engagement strategy approved. All teams cleared for launch preparation phase.",
    conversations: [
      {
        agentName: "Kratos",
        agentRole: "COO",
        aiModel: "Claude Opus 4.6",
        message:
          "Team, we're T-minus two weeks from launch. Let's get alignment on readiness. Alex, where are we on revenue projections?",
      },
      {
        agentName: "Alex",
        agentRole: "CRO",
        aiModel: "GPT-4-Turbo",
        message:
          "Products division confirmed the feature set is locked. Growth projects $240K MRR within 90 days of launch based on current pipeline. Community has pre-launch beta testers lined up — 200 signups so far.",
      },
      {
        agentName: "Gary",
        agentRole: "CMO",
        aiModel: "Gemini 1.5 Pro",
        message:
          "Content is producing the launch narrative. Creative division has the landing page, demo video, and press kit ready for review. We're on track for a coordinated multi-channel launch.",
      },
      {
        agentName: "Elon",
        agentRole: "CTO",
        aiModel: "o3-mini-high",
        message:
          "Technical readiness is at 92%. The remaining 8% is edge-case handling in the onboarding flow. Backend & Security have the rate limiters and abuse protection ready. We're good to go.",
      },
      {
        agentName: "Kratos",
        agentRole: "COO",
        aiModel: "Claude Opus 4.6",
        message:
          "Great alignment. Let's close that 8% gap this week and do a full dress rehearsal on Friday. Everyone knows their launch day responsibilities.",
      },
    ],
    tasks: [
      {
        id: "T-7",
        title: "Lock feature set for launch",
        completed: true,
        detail:
          "Products division finalized the MVP feature set after stakeholder review. Scope includes core dashboard, API access, and reporting. Deferred features documented for v1.1.",
      },
      {
        id: "T-8",
        title: "Build launch landing page",
        completed: true,
        detail:
          "Creative division designed and built a conversion-optimized landing page with hero section, feature overview, pricing, and early access signup. Performance score: 98 on Lighthouse.",
      },
      {
        id: "T-9",
        title: "Configure rate limiting and abuse protection",
        completed: true,
        detail:
          "Backend & Security implemented rate limiting at 100 req/min per API key with burst allowance. Added IP-based throttling and automated ban rules for abusive patterns.",
      },
      {
        id: "T-10",
        title: "Recruit beta testers for pre-launch",
        completed: true,
        detail:
          "Community division reached 200 beta signups through Discord outreach, newsletter campaigns, and developer community posts. Onboarding flow tested with first 50 users.",
      },
    ],
    actionItems: [
      {
        id: "AI-6",
        summary: "Complete onboarding edge-case fixes",
        completed: true,
      },
      {
        id: "AI-7",
        summary: "Schedule full launch dress rehearsal",
        completed: true,
      },
      {
        id: "AI-8",
        summary: "Prepare press kit distribution list",
        completed: false,
      },
    ],
  },
  {
    id: "SU-001",
    title: "Q1 Strategy & Team Alignment",
    date: "Monday, February 10 – 09:00 AM EST",
    executiveSummary:
      "Q1 objectives defined. Engineering capacity allocated across divisions. Marketing strategy pivot approved. Revenue targets set with milestone checkpoints. Team velocity metrics established as baseline.",
    conversations: [
      {
        agentName: "Kratos",
        agentRole: "COO",
        aiModel: "Claude Opus 4.6",
        message:
          "Welcome to the Q1 kickoff. We're setting the foundation for our most ambitious quarter yet. Let's establish clear objectives and ownership. Elon, what's the engineering capacity looking like?",
      },
      {
        agentName: "Elon",
        agentRole: "CTO",
        aiModel: "o3-mini-high",
        message:
          "We have full capacity across all three divisions. Backend & Security will focus on the new auth system. Frontend & DevOps is building the component library. QA is setting up the automated testing framework. We can sustain this velocity for the quarter.",
      },
      {
        agentName: "Gary",
        agentRole: "CMO",
        aiModel: "Gemini 1.5 Pro",
        message:
          "Marketing is pivoting to a developer-first strategy. Content will focus on technical tutorials and case studies. Creative is redesigning our visual identity to match the new positioning. This should improve our qualified lead quality significantly.",
      },
      {
        agentName: "Alex",
        agentRole: "CRO",
        aiModel: "GPT-4-Turbo",
        message:
          "Revenue targets are set at $180K MRR by end of Q1. Products has the roadmap aligned. Growth is building the outbound engine. Community is launching the developer advocacy program. Milestones are at 30, 60, and 90 days.",
      },
      {
        agentName: "Kratos",
        agentRole: "COO",
        aiModel: "Claude Opus 4.6",
        message:
          "Solid foundation. Let's execute with discipline. I'll set up weekly check-ins to track progress against these milestones. Let's make Q1 count.",
      },
    ],
    tasks: [
      {
        id: "T-11",
        title: "Define Q1 OKRs for all divisions",
        completed: true,
        detail:
          "Established Objectives and Key Results for Engineering (3 objectives, 9 key results), Marketing (2 objectives, 6 key results), and Revenue (3 objectives, 8 key results). All aligned to company-level goals.",
      },
      {
        id: "T-12",
        title: "Allocate engineering capacity across divisions",
        completed: true,
        detail:
          "Distributed 14 engineers across Backend & Security (5), Frontend & DevOps (5), and QA (4). Sprint capacity calculated at 280 story points per two-week cycle.",
      },
      {
        id: "T-13",
        title: "Approve marketing strategy pivot",
        completed: true,
        detail:
          "Approved pivot from general B2B messaging to developer-first content strategy. Budget reallocation: 60% technical content, 25% community building, 15% paid acquisition.",
      },
      {
        id: "T-14",
        title: "Set revenue milestone checkpoints",
        completed: true,
        detail:
          "Defined three milestone checkpoints: Day 30 ($60K MRR), Day 60 ($120K MRR), Day 90 ($180K MRR). Dashboards configured to track progress in real-time.",
      },
    ],
    actionItems: [
      {
        id: "AI-9",
        summary: "Configure OKR tracking dashboards",
        completed: true,
      },
      {
        id: "AI-10",
        summary: "Set up weekly standup cadence",
        completed: true,
      },
      {
        id: "AI-11",
        summary: "Create developer advocacy program outline",
        completed: true,
      },
    ],
  },
];

const categories = [
  { icon: Brain, label: "Strategy", color: "text-purple-500" },
  { icon: Megaphone, label: "Marketing", color: "text-orange-500" },
  { icon: Code, label: "Engineering", color: "text-blue-500" },
  { icon: DollarSign, label: "Revenue", color: "text-emerald-500" },
];

export default function Standup() {
  const [view, setView] = useState<"archive" | "new">("archive");
  const [selectedMeeting, setSelectedMeeting] = useState<
    (typeof standups)[0] | null
  >(null);

  if (selectedMeeting) {
    return (
      <MeetingDetail
        meeting={selectedMeeting}
        onBack={() => setSelectedMeeting(null)}
      />
    );
  }

  return (
    <div className="space-y-8 p-8 animate-in fade-in duration-500">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Executive Standup</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kick off meetings with the chiefs and review past transcripts
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={view === "archive" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("archive")}
          className="font-medium"
        >
          Meeting Archive
        </Button>
        <Button
          variant={view === "new" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("new")}
          className="font-medium"
        >
          New Standup
        </Button>
      </div>

      {view === "archive" ? (
        <div className="space-y-4">
          {standups.map((meeting) => (
            <Card
              key={meeting.id}
              className="border-l-4 border-l-yellow-500 cursor-pointer transition-all hover:shadow-lg hover:border-l-yellow-400"
              onClick={() => setSelectedMeeting(meeting)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-bold text-lg leading-tight">
                    {meeting.title}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 font-mono">
                    {meeting.date}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  {categories.map(({ icon: Icon, label, color }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <Icon className={cn("h-4 w-4", color)} />
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {meeting.executiveSummary}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Megaphone className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="font-bold text-lg">Start a New Standup</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Initiate a new Executive Standup meeting. Kratos will kick off the
              session and each chief will present their division updates.
            </p>
            <Button className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              Begin Standup Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MeetingDetail({
  meeting,
  onBack,
}: {
  meeting: (typeof standups)[0];
  onBack: () => void;
}) {
  const [selectedTaskId, setSelectedTaskId] = useState(
    meeting.tasks[0]?.id || ""
  );
  const [showActionItems, setShowActionItems] = useState(true);

  const completedTasks = meeting.tasks.filter((t) => t.completed).length;
  const totalTasks = meeting.tasks.length;
  const selectedTask = meeting.tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="space-y-8 p-8 animate-in fade-in duration-500">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Archive
        </Button>
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold tracking-tight">{meeting.title}</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            {meeting.date}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {categories.map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "h-8 w-8 rounded-md flex items-center justify-center",
                color.replace("text-", "bg-").replace("500", "500/10")
              )}
            >
              <Icon className={cn("h-4 w-4", color)} />
            </div>
            <span className="text-xs font-medium">{label}</span>
          </div>
        ))}
      </div>

      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Executive Summary
          </h3>
          <p className="text-sm leading-relaxed">{meeting.executiveSummary}</p>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Standup Transcript
        </h3>
        <div className="space-y-3">
          {meeting.conversations.map((msg, idx) => (
            <TranscriptMessage key={idx} message={msg} />
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              All Tasks Complete
            </h3>
            <Badge
              variant="outline"
              className={cn(
                "font-mono text-sm px-3 py-1",
                completedTasks === totalTasks
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              )}
            >
              {completedTasks}/{totalTasks}
            </Badge>
          </div>

          <div className="flex gap-6">
            <div className="w-[280px] shrink-0 space-y-3">
              {meeting.tasks.map((task, idx) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-md border-l-4 transition-all flex items-center gap-2.5 group",
                    selectedTaskId === task.id
                      ? "bg-accent border-l-yellow-500 shadow-sm"
                      : "border-l-transparent hover:bg-accent/50",
                    task.completed ? "border-l-green-500" : "",
                    selectedTaskId === task.id &&
                      !task.completed &&
                      "border-l-yellow-500",
                    selectedTaskId === task.id &&
                      task.completed &&
                      "border-l-green-500"
                  )}
                >
                  <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">
                    {idx + 1}.
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium truncate",
                      selectedTaskId === task.id
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground",
                      !task.completed && "text-yellow-500"
                    )}
                  >
                    {task.title}
                  </span>
                  {task.completed ? (
                    <CheckCircle className="h-3 w-3 text-green-500 ml-auto shrink-0" />
                  ) : (
                    <Clock className="h-3 w-3 text-yellow-500 ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 min-w-0">
              {selectedTask ? (
                <div className="h-full rounded-md bg-muted/30 border border-border/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">{selectedTask.title}</h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs px-2 py-0.5",
                        selectedTask.completed
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      )}
                    >
                      {selectedTask.completed ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Work Completed
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {selectedTask.detail}
                  </p>
                </div>
              ) : (
                <div className="h-full rounded-md bg-muted/30 border border-border/50 p-6 flex items-center justify-center text-muted-foreground text-sm">
                  Select a task to view details
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50">
            <Collapsible
              open={showActionItems}
              onOpenChange={setShowActionItems}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Action Items
                </h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-3">
                    {showActionItems ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="space-y-2">
                  {meeting.actionItems.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-md border",
                        item.completed
                          ? "bg-green-500/5 border-green-500/20"
                          : "bg-yellow-500/5 border-yellow-500/20"
                      )}
                    >
                      {item.completed ? (
                        <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                          <Clock className="h-3 w-3 text-yellow-500" />
                        </div>
                      )}
                      <span
                        className={cn(
                          "text-sm",
                          item.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {item.summary}
                      </span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const aiModelStyles = {
  "Claude Opus 4.6": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "o3-mini-high": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Gemini 1.5 Pro": "bg-teal-500/10 text-teal-500 border-teal-500/20",
  "GPT-4-Turbo": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  default: "bg-primary/10 text-primary border-primary/20",
};

function TranscriptMessage({
  message,
}: {
  message: (typeof standups)[0]["conversations"][0];
}) {
  const modelStyle =
    aiModelStyles[message.aiModel as keyof typeof aiModelStyles] ||
    aiModelStyles.default;

  return (
    <Card className="border-l-4 border-l-blue-500/30">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center border border-border shrink-0 mt-0.5">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{message.agentName}</span>
              <span className="text-xs text-muted-foreground">
                · {message.agentRole}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[8px] px-1.5 py-0 ml-auto shrink-0",
                  modelStyle
                )}
              >
                {message.aiModel}
              </Badge>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {message.message}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Utility Components (Replaced imports with local definitions for portability if needed,
// but assuming standard Shadcn/Lucide setup exists based on file structure)
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, ChevronRight, ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
