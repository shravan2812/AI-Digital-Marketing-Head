import { useEffect, useState } from "react";
import {
  getClientById,
  updateClient,
} from "../api/clients";
import { useNavigate, useParams } from "react-router-dom";

const EditClient = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadClient = async () => {
      if (!clientId) {
        setError("Client ID is missing");
        setLoading(false);
        return;
      }

      try {
        const result = await getClientById(clientId);

        const client = result.client;

        setName(client.name || "");
        setWebsite(client.website || "");
        setIndustry(client.industry || "");
        setDescription(client.description || "");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to load client");
        }
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [clientId]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!clientId) {
      setError("Client ID is missing");
      return;
    }

    setError("");
    setSaving(true);

    try {
      await updateClient(clientId, {
        name,
        website,
        industry,
        description,
      });

      navigate("/dashboard/clients");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update client");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Edit Client
        </h1>

        <p className="text-gray-500">
          Loading client...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Client
        </h1>

        <p className="text-gray-500 mt-1">
          Update client information
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 max-w-2xl">
        {error && (
          <div className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Client Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Client Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Website */}
          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Website
            </label>

            <input
              id="website"
              type="text"
              value={website}
              onChange={(event) =>
                setWebsite(event.target.value)
              }
              placeholder="https://example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Industry */}
          <div>
            <label
              htmlFor="industry"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Industry
            </label>

            <input
              id="industry"
              type="text"
              value={industry}
              onChange={(event) =>
                setIndustry(event.target.value)
              }
              placeholder="e.g. Technology"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard/clients")
              }
              className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClient;