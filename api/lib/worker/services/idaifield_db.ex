defmodule Services.IdaiFieldDb do
  alias Core.CorePropertiesAtomizing
  alias Services.ResultHandler
  require Logger

  @doc """
  returns nil if document not available
  """
  def get_doc(db), do: fn id -> get_doc(db, id) end
  def get_doc(db, id) do
    auth = [hackney: [basic_auth: {Core.Config.get(:couchdb_user), Core.Config.get(:couchdb_password)}]]

    result = HTTPoison.get("#{Core.Config.get(:couchdb_url)}/#{db}/#{id}", %{}, auth)
             |> ResultHandler.handle_result

    case result do
      document = %{ "resource" => resource } -> CorePropertiesAtomizing.format_document document
      nil -> nil
      unexpected -> Logger.error "(Services.IdaiFieldDb) Unexpected: #{inspect unexpected}"
                    nil
    end
  end

  def fetch_changes(db) do
    auth = [hackney: [basic_auth: {Core.Config.get(:couchdb_user), Core.Config.get(:couchdb_password)}]]
    HTTPoison.get("#{Core.Config.get(:couchdb_url)}/#{db}/_changes?include_docs=true", %{}, auth)
    |> ResultHandler.handle_result
    |> get_in(["results"])
    |> CorePropertiesAtomizing.format_changes
    |> update_in([Access.all(), :doc], &(Map.drop(&1, [:_id, :_rev, :_attachments])))
  end
end
