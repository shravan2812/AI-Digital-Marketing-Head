import { useEffect, useState } from "react";
import { getMyAgency } from "../api/agency";
import { getTeamMembers, type TeamMember } from "../api/team";
import { getClients } from "../api/clients";
import {
  createAudit,
  getAudit,
  type Audit,
} from "../api/audit";

interface Agency {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

interface Client {
  id: string;
  agency_id: string;
  name: string;
  website: string | null;
  industry: string | null;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [latestAudit, setLatestAudit] = useState<Audit | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState("");
  const handleTestAudit = async (
    clientId: string,
    url: string | null
  ) => {
    try {
      if (!url) {
        setAuditError("Client website URL is missing");
        return;
      }

      setAuditLoading(true);
      setAuditError("");
      setLatestAudit(null);

      const result = await createAudit(clientId, url);

      console.log("Audit created:", result);

      const auditResult = await getAudit(result.audit.id);

      console.log("Full audit:", auditResult);

      setLatestAudit(auditResult.audit);
    } catch (error) {
      console.error("Audit failed:", error);

      if (error instanceof Error) {
        setAuditError(error.message);
      } else {
        setAuditError("Audit failed");
      }
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [agencyResult, teamResult, clientsResult] =
          await Promise.all([
            getMyAgency(),
            getTeamMembers(),
            getClients(),
          ]);

        setAgency(agencyResult.data);
        setTeamMembers(teamResult.members);
        setClients(clientsResult.clients);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to load dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">


      {/* Main Content */}
      <main className="flex-1 p-6">

        <div className="max-w-4xl mx-auto">

          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Dashboard
          </h1>

          {loading && (
            <p className="text-gray-500">
              Loading dashboard...
            </p>
          )}

          {error && (
            <div className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-6">

              {/* Agency Information */}
              {agency && (
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Agency Information
                  </h2>

                  <div className="space-y-3">
                    <p>
                      <span className="font-semibold">
                        Agency Name:
                      </span>{" "}
                      {agency.name}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Slug:
                      </span>{" "}
                      {agency.slug}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Website:
                      </span>{" "}
                      {agency.website || "Not provided"}
                    </p>
                  </div>
                </div>
              )}

              {/* Team Overview */}
              <div className="bg-white rounded-xl shadow p-6">

                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Team Overview
                  </h2>

                  <span className="text-sm text-gray-500">
                    {teamMembers.length} member
                    {teamMembers.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {teamMembers.length === 0 ? (
                  <p className="text-gray-500">
                    No team members found.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">

                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {member.name}
                            </h3>

                            <p className="text-sm text-gray-500">
                              {member.email}
                            </p>
                          </div>

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                            {member.role}
                          </span>

                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
              {/* Client Overview */}

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Client Overview
                  </h2>

                  <span className="text-sm text-gray-500">
                    {clients.length} client
                    {clients.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {clients.length === 0 ? (
                  <p className="text-gray-500">
                    No clients found.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {clients.map((client) => (
                      <div
                        key={client.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {client.name}
                            </h3>

                            <p className="text-sm text-gray-500">
                              {client.industry || "Industry not provided"}
                            </p>
                          </div>

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                            {client.status}
                          </span>
                          <button
                            onClick={() => handleTestAudit(client.id, client.website)}
                            className="..."
                          >
                            Test Audit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Latest Audit */}
              {auditLoading && (
                <div className="bg-white rounded-xl shadow p-6">
                  <p className="text-gray-500">
                    Running website audit...
                  </p>
                </div>
              )}

              {auditError && (
                <div className="bg-red-100 rounded-xl p-6 text-red-700">
                  {auditError}
                </div>
              )}

              {latestAudit && (
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Latest Audit
                  </h2>

                  <div className="space-y-3">
                    <p>
                      <span className="font-semibold">
                        URL:
                      </span>{" "}
                      {latestAudit.url}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Status:
                      </span>{" "}
                      {latestAudit.status}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Created:
                      </span>{" "}
                      {new Date(latestAudit.created_at).toLocaleString()}
                    </p>

                    {latestAudit.audit_data && (
                      <>
                        <hr className="my-4" />

                        <h3 className="text-lg font-bold text-gray-900">
                          SEO Analysis
                        </h3>

                        <p>
                          <span className="font-semibold">
                            SEO Score:
                          </span>{" "}
                          {latestAudit.audit_data.seo.score}
                        </p>

                        <h3 className="text-lg font-bold text-gray-900 mt-4">
                          Website Structure
                        </h3>

                        <p>
                          <span className="font-semibold">
                            Title:
                          </span>{" "}
                          {latestAudit.audit_data.parsed.title || "Not found"}
                        </p>

                        <p>
                          <span className="font-semibold">
                            Meta Description:
                          </span>{" "}
                          {latestAudit.audit_data.parsed.metaDescription ||
                            "Not found"}
                        </p>

                        <p>
                          <span className="font-semibold">
                            H1 Count:
                          </span>{" "}
                          {latestAudit.audit_data.parsed.h1Count}
                        </p>

                        <p>
                          <span className="font-semibold">
                            H2 Count:
                          </span>{" "}
                          {latestAudit.audit_data.parsed.h2Count}
                        </p>

                        <p>
                          <span className="font-semibold">
                            Word Count:
                          </span>{" "}
                          {latestAudit.audit_data.parsed.wordCount}
                        </p>

                        <p>
                          <span className="font-semibold">
                            Images:
                          </span>{" "}
                          {latestAudit.audit_data.parsed.imageCount}
                        </p>

                        <p>
                          <span className="font-semibold">
                            Images Without ALT:
                          </span>{" "}
                          {latestAudit.audit_data.parsed.imagesWithoutAlt}
                        </p>
                      </>
                    )}

                    {latestAudit.error_message && (
                      <p className="text-red-600">
                        <span className="font-semibold">
                          Error:
                        </span>{" "}
                        {latestAudit.error_message}
                      </p>
                    )}
                  </div>
                </div>
              )}


            </div>
          )}

        </div>

      </main>

    </div>
  );
};

export default Dashboard;