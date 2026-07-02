import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Boxes, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/modeling")({
  head: () => ({
    meta: [
      { title: "Modeling Studio — Enterprise Data Platform" },
      {
        name: "description",
        content:
          "Conceptual, logical, physical, and ER data modeling views for governed enterprise domains.",
      },
    ],
  }),
  component: ModelingPage,
});

const ENTITIES = [
  {
    name: "Customer",
    attrs: 18,
    owner: "C. Adler",
    steward: "G. Patel",
    sens: "Confidential",
    dq: 12,
    downstream: 9,
    pk: "customer_id",
  },
  {
    name: "Account",
    attrs: 14,
    owner: "R. Costa",
    steward: "L. Mendes",
    sens: "Confidential",
    dq: 9,
    downstream: 7,
    pk: "account_id",
  },
  {
    name: "Transaction",
    attrs: 22,
    owner: "R. Costa",
    steward: "L. Mendes",
    sens: "Confidential",
    dq: 16,
    downstream: 14,
    pk: "txn_id",
  },
  {
    name: "Product",
    attrs: 11,
    owner: "MDM",
    steward: "J. Tan",
    sens: "Internal",
    dq: 4,
    downstream: 12,
    pk: "product_id",
  },
  {
    name: "Claim",
    attrs: 20,
    owner: "S. Khan",
    steward: "A. Rivera",
    sens: "Restricted",
    dq: 18,
    downstream: 8,
    pk: "claim_id",
  },
  {
    name: "Policy",
    attrs: 16,
    owner: "S. Khan",
    steward: "A. Rivera",
    sens: "Restricted",
    dq: 11,
    downstream: 9,
    pk: "policy_id",
  },
  {
    name: "Consent",
    attrs: 9,
    owner: "DPO",
    steward: "G. Patel",
    sens: "Restricted",
    dq: 8,
    downstream: 6,
    pk: "consent_id",
  },
  {
    name: "Risk Score",
    attrs: 7,
    owner: "T. Brooks",
    steward: "N. Osei",
    sens: "Restricted",
    dq: 6,
    downstream: 5,
    pk: "risk_id",
  },
  {
    name: "Invoice",
    attrs: 13,
    owner: "K. Wu",
    steward: "L. Mendes",
    sens: "Confidential",
    dq: 7,
    downstream: 4,
    pk: "invoice_id",
  },
  {
    name: "Payment",
    attrs: 12,
    owner: "K. Wu",
    steward: "L. Mendes",
    sens: "Confidential",
    dq: 9,
    downstream: 5,
    pk: "payment_id",
  },
];

const RELATIONSHIPS = [
  ["Customer", "Account", "1 : N"],
  ["Account", "Transaction", "1 : N"],
  ["Customer", "Policy", "1 : N"],
  ["Policy", "Claim", "1 : N"],
  ["Customer", "Consent", "1 : N"],
  ["Customer", "Risk Score", "1 : 1"],
  ["Account", "Invoice", "1 : N"],
  ["Invoice", "Payment", "1 : N"],
  ["Transaction", "Product", "N : 1"],
];

const VALIDATIONS = [
  { check: "Naming standard (snake_case, singular noun)", pass: 8, fail: 2 },
  { check: "Mandatory attribute coverage", pass: 9, fail: 1 },
  { check: "Primary key defined", pass: 10, fail: 0 },
  { check: "Foreign key integrity", pass: 9, fail: 1 },
  { check: "Glossary linkage", pass: 7, fail: 3 },
];

const ER_NODES = [
  { name: "Customer", x: 60, y: 50, attrs: ["customer_id PK", "full_name", "consent_status"] },
  { name: "Account", x: 320, y: 50, attrs: ["account_id PK", "customer_id FK", "status"] },
  { name: "Transaction", x: 580, y: 50, attrs: ["txn_id PK", "account_id FK", "amount"] },
  { name: "Consent", x: 60, y: 230, attrs: ["consent_id PK", "customer_id FK", "purpose"] },
  { name: "Policy", x: 320, y: 230, attrs: ["policy_id PK", "customer_id FK", "coverage"] },
  { name: "Claim", x: 580, y: 230, attrs: ["claim_id PK", "policy_id FK", "claim_amount"] },
  { name: "Invoice", x: 320, y: 410, attrs: ["invoice_id PK", "account_id FK", "due_date"] },
  { name: "Payment", x: 580, y: 410, attrs: ["payment_id PK", "invoice_id FK", "amount"] },
];

const ER_EDGES = [
  { from: "Customer", to: "Account", label: "1:N" },
  { from: "Account", to: "Transaction", label: "1:N" },
  { from: "Customer", to: "Consent", label: "1:1" },
  { from: "Policy", to: "Claim", label: "1:N" },
  { from: "Account", to: "Invoice", label: "1:N" },
  { from: "Invoice", to: "Payment", label: "1:1" },
];

function ERDiagram() {
  const nodeByName = Object.fromEntries(ER_NODES.map((node) => [node.name, node]));
  return (
    <div className="overflow-x-auto rounded-md border bg-muted/20 p-3">
      <svg
        width="780"
        height="560"
        viewBox="0 0 780 560"
        role="img"
        aria-label="Entity relationship diagram"
      >
        <defs>
          <marker
            id="er-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#D97706" />
          </marker>
        </defs>
        {ER_EDGES.map((edge) => {
          const from = nodeByName[edge.from];
          const to = nodeByName[edge.to];
          const x1 = from.x + 160;
          const y1 = from.y + 55;
          const x2 = to.x;
          const y2 = to.y + 55;
          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#D97706"
                strokeWidth="2"
                markerEnd="url(#er-arrow)"
              />
              <text
                x={(x1 + x2) / 2}
                y={(y1 + y2) / 2 - 6}
                fontSize="11"
                fill="#92400e"
                fontWeight="600"
              >
                {edge.label}
              </text>
            </g>
          );
        })}
        {ER_NODES.map((node) => (
          <g key={node.name}>
            <rect
              x={node.x}
              y={node.y}
              width="160"
              height="112"
              rx="8"
              fill="white"
              stroke="#2563EB"
              strokeWidth="1.5"
            />
            <rect x={node.x} y={node.y} width="160" height="30" rx="8" fill="#2563EB" />
            <text x={node.x + 12} y={node.y + 20} fontSize="13" fill="white" fontWeight="700">
              {node.name}
            </text>
            {node.attrs.map((attr, idx) => (
              <text
                key={attr}
                x={node.x + 12}
                y={node.y + 52 + idx * 18}
                fontSize="11"
                fill="#334155"
              >
                {attr}
              </text>
            ))}
          </g>
        ))}
        <g transform="translate(60 520)">
          <rect width="220" height="26" rx="6" fill="#EFF6FF" stroke="#2563EB" />
          <text x="12" y="17" fontSize="11" fill="#1d4ed8">
            Blue boxes: governed entities
          </text>
          <line
            x1="250"
            y1="13"
            x2="310"
            y2="13"
            stroke="#D97706"
            strokeWidth="2"
            markerEnd="url(#er-arrow)"
          />
          <text x="320" y="17" fontSize="11" fill="#92400e">
            Amber arrows: FK relationships
          </text>
        </g>
      </svg>
    </div>
  );
}

function ModelingPage() {
  const [impact, setImpact] = useState<string | null>(null);

  const runImpact = () => {
    setImpact(null);
    toast.message("Analyzing impact of changing Customer.customer_id …");
    setTimeout(() => {
      setImpact(
        "Change to Customer.customer_id will affect 9 downstream datasets, 4 dashboards, 2 ML models, and 6 lineage edges. Estimated 12 stewardship reviews required. Recommended migration window: 2 weekends with dual-write.",
      );
      toast.success("Impact analysis complete");
    }, 1000);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader dmbok="data-modeling"
        title="Data Modeling Studio"
        description="Synthetic Demo Data · Conceptual, logical, and physical model views with standards validation and change impact."
        actions={
          <Button onClick={runImpact}>
            <Sparkles className="size-4" />
            Analyze Change Impact
          </Button>
        }
      />

      {impact && (
        <Card className="p-4 mb-4 border-primary/40 bg-primary/5">
          <div className="text-xs uppercase tracking-wide text-primary mb-1">
            AI Impact Analysis
          </div>
          <div className="text-sm">{impact}</div>
        </Card>
      )}

      <Tabs defaultValue="entities">
        <TabsList>
          <TabsTrigger value="entities">
            <Boxes className="size-4 mr-1" />
            Entities
          </TabsTrigger>
          <TabsTrigger value="conceptual">Conceptual</TabsTrigger>
          <TabsTrigger value="logical">Logical</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="validation">Standards</TabsTrigger>
        </TabsList>

        <TabsContent value="entities" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity</TableHead>
                  <TableHead>Attrs</TableHead>
                  <TableHead>PK</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Steward</TableHead>
                  <TableHead>Sensitivity</TableHead>
                  <TableHead>DQ Rules</TableHead>
                  <TableHead>Downstream</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ENTITIES.map((e) => (
                  <TableRow key={e.name}>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell>{e.attrs}</TableCell>
                    <TableCell className="font-mono text-xs">{e.pk}</TableCell>
                    <TableCell className="text-xs">{e.owner}</TableCell>
                    <TableCell className="text-xs">{e.steward}</TableCell>
                    <TableCell>
                      <Badge variant={e.sens === "Restricted" ? "destructive" : "secondary"}>
                        {e.sens}
                      </Badge>
                    </TableCell>
                    <TableCell>{e.dq}</TableCell>
                    <TableCell>{e.downstream}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="conceptual" className="mt-4">
          <Card className="p-6">
            <div className="font-semibold mb-3">Conceptual Model — Core Business Entities</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {ENTITIES.map((e) => (
                <div key={e.name} className="rounded-md border p-3 bg-muted/30">
                  <div className="font-medium">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.owner}</div>
                </div>
              ))}
            </div>
            <div className="font-semibold mt-6 mb-2">Entity Relationship Matrix</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parent</TableHead>
                  <TableHead>Child</TableHead>
                  <TableHead>Cardinality</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RELATIONSHIPS.map((r) => (
                  <TableRow key={r.join("-")}>
                    <TableCell>{r[0]}</TableCell>
                    <TableCell>{r[1]}</TableCell>
                    <TableCell className="font-mono text-xs">{r[2]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="logical" className="mt-4">
          <Card className="p-6 space-y-5">
            <div>
              <div className="font-semibold mb-3">Logical Model — Entity Relationship Diagram</div>
              <ERDiagram />
            </div>
            <div>
              <div className="font-semibold mb-3">Logical Model — Customer</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Attribute</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Glossary Term</TableHead>
                    <TableHead>Sensitivity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["customer_id", "UUID", "Customer Identifier", "Internal"],
                    ["full_name", "STRING(120)", "Customer Name", "Confidential"],
                    ["email", "STRING(255)", "Email Address", "Confidential"],
                    ["date_of_birth", "DATE", "Date of Birth", "Restricted"],
                    ["consent_status", "ENUM", "Consent Status", "Restricted"],
                    ["segment", "STRING(40)", "Customer Segment", "Internal"],
                    ["risk_score", "DECIMAL(5,2)", "Delinquency Risk Score", "Restricted"],
                  ].map((r) => (
                    <TableRow key={r[0]}>
                      <TableCell className="font-mono text-xs">{r[0]}</TableCell>
                      <TableCell className="text-xs">{r[1]}</TableCell>
                      <TableCell className="text-xs">{r[2]}</TableCell>
                      <TableCell>
                        <Badge variant={r[3] === "Restricted" ? "destructive" : "secondary"}>
                          {r[3]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="physical" className="mt-4">
          <Card className="p-6">
            <div className="font-semibold mb-3">Physical Model — dwh.dim_customer</div>
            <pre className="text-xs bg-muted/40 p-4 rounded-md overflow-x-auto">{`CREATE TABLE dwh.dim_customer (
  customer_id      UUID         PRIMARY KEY,
  full_name        VARCHAR(120) NOT NULL,
  email_token      CHAR(64)     NOT NULL,  -- tokenized
  phone_token      CHAR(64),               -- tokenized
  dob_masked       VARCHAR(10),            -- yyyy-**-**
  consent_status   VARCHAR(20)  NOT NULL,
  segment          VARCHAR(40),
  risk_score       NUMERIC(5,2),
  source_system    VARCHAR(40)  NOT NULL,
  effective_from   TIMESTAMP    NOT NULL,
  effective_to     TIMESTAMP,
  is_current       BOOLEAN      DEFAULT TRUE
)
PARTITION BY RANGE (effective_from);`}</pre>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="mt-4">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Check</TableHead>
                  <TableHead>Pass</TableHead>
                  <TableHead>Fail</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VALIDATIONS.map((v) => (
                  <TableRow key={v.check}>
                    <TableCell>{v.check}</TableCell>
                    <TableCell className="text-emerald-600">{v.pass}</TableCell>
                    <TableCell className="text-rose-600">{v.fail}</TableCell>
                    <TableCell>
                      {v.fail === 0 ? (
                        <Badge>
                          <CheckCircle2 className="size-3 mr-1" />
                          Pass
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertTriangle className="size-3 mr-1" />
                          Action needed
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
