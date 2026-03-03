"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search } from "lucide-react";

export interface MemberRow {
  login: string;
  avatarUrl: string;
  lastActivityAt: string | null;
  lastActivityEditor: string | null;
  totalInteractions: number;
  codeGenerations: number;
  codeAcceptances: number;
  locAdded: number;
  locDeleted: number;
  chatRequests: number;
  isActive: boolean;
}

interface MembersTableProps {
  data: MemberRow[];
}

type SortKey = keyof MemberRow;
type SortDir = "asc" | "desc";

export function MembersTable({ data }: MembersTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("totalInteractions");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    let result = [...data];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.login.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [data, search, sortKey, sortDir]);

  const SortButton = ({ label, field }: { label: string; field: SortKey }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={() => handleSort(field)}
    >
      {label}
      <ArrowUpDown className="ml-1 h-3 w-3" />
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead><SortButton label="Status" field="isActive" /></TableHead>
              <TableHead><SortButton label="Last Active" field="lastActivityAt" /></TableHead>
              <TableHead className="text-right"><SortButton label="Interactions" field="totalInteractions" /></TableHead>
              <TableHead className="text-right"><SortButton label="Generations" field="codeGenerations" /></TableHead>
              <TableHead className="text-right"><SortButton label="Acceptances" field="codeAcceptances" /></TableHead>
              <TableHead className="text-right"><SortButton label="LoC Added" field="locAdded" /></TableHead>
              <TableHead className="text-right"><SortButton label="Chat" field="chatRequests" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No members found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((member) => (
                <TableRow key={member.login}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.avatarUrl}
                        alt={member.login}
                        className="h-8 w-8 rounded-full"
                      />
                      <a
                        href={`https://github.com/${member.login}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline"
                      >
                        {member.login}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.isActive ? "default" : "secondary"}>
                      {member.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {member.lastActivityAt
                      ? new Date(member.lastActivityAt).toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {member.totalInteractions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {member.codeGenerations.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {member.codeAcceptances.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {member.locAdded.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {member.chatRequests.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {data.length} members
      </p>
    </div>
  );
}
