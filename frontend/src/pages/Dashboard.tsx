import { useEffect, useState } from "react";
import { getMyAgency } from "../api/agency";
import { getTeamMembers, type TeamMember } from "../api/team";
import { getClients } from "../api/clients";

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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
};

export default Dashboard;