import { useEffect, useState } from "react";
import { getClients, deactivateClient, deleteClient, } from "../api/clients";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

const Clients = () => {
    const { role } = useAuth();
    const navigate = useNavigate();

    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleDeactivate = async (clientId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to deactivate this client?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deactivateClient(clientId);

            // Refresh the client list
            const result = await getClients();
            setClients(result.clients);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to deactivate client");
            }
        }
    };

    const handleDelete = async (clientId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this client?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteClient(clientId);

            const result = await getClients();
            setClients(result.clients);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to delete client");
            }
        }
    };

    useEffect(() => {
        const loadClients = async () => {
            try {
                const result = await getClients();

                setClients(result.clients);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Failed to load clients");
                }
            } finally {
                setLoading(false);
            }
        };

        loadClients();
    }, []);

    if (loading) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Clients
                </h1>

                <p className="text-gray-500">
                    Loading clients...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Clients
                </h1>

                <div className="rounded-lg bg-red-100 px-4 py-3 text-red-700">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Clients
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage your agency clients
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                        {clients.length} client
                        {clients.length !== 1 ? "s" : ""}
                    </span>

                    {/* ADMIN + MANAGER */}
                    {(role === "ADMIN" || role === "MANAGER") && (
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/dashboard/clients/new")
                            }
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Add Client
                        </button>
                    )}
                </div>
            </div>

            {/* Empty state */}
            {clients.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                        No clients found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Your agency does not have any clients yet.
                    </p>
                </div>
            ) : (
                /* Client list */
                <div className="space-y-4">
                    {clients.map((client) => (
                        <div
                            key={client.id}
                            className="bg-white rounded-xl shadow p-6"
                        >
                            {/* Client information */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {client.name}
                                    </h2>

                                    {client.website && (
                                        <p className="text-sm text-blue-600 mt-1">
                                            {client.website}
                                        </p>
                                    )}

                                    {client.industry && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            Industry: {client.industry}
                                        </p>
                                    )}

                                    {client.description && (
                                        <p className="text-gray-600 mt-3">
                                            {client.description}
                                        </p>
                                    )}
                                </div>

                                {/* Status */}
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                                    {client.status}
                                </span>
                            </div>

                            {/* Role-based actions */}
                            <div className="flex items-center gap-2 mt-4">

                                {/* ADMIN + MANAGER */}
                                {(role === "ADMIN" || role === "MANAGER") && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                console.log("Edit clicked:", client.id);
                                                navigate(`/dashboard/clients/${client.id}/edit`);
                                            }}
                                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDeactivate(client.id)}
                                            className="rounded-lg border border-yellow-300 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-50"
                                        >
                                            Deactivate
                                        </button>
                                    </>
                                )}

                                {/* ADMIN only */}
                                {role === "ADMIN" && (
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(client.id)}
                                        className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Clients;