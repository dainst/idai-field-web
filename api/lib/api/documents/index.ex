defmodule Api.Documents.Index do
  require Logger
  alias Api.Documents.Mapping
  alias Api.Documents.Query

  @max_geometries 10000
  @exists_geometries ["resource.geometry"]
  @fields_geometries ["resource.category", "resource.geometry", "resource.identifier", "resource.id", "project"]

  def get(id) do
    Query.init("_id:#{id}", 1)
    |> Query.build
    |> post_query
    |> get_in(["hits", "hits", Access.at(0), "_source"])
    |> Core.CorePropertiesAtomizing.format_document
  end

  def search(q, size, from, filters, must_not, exists) do
    Query.init(q, size, from)
    |> Query.track_total
    |> Query.add_aggregations()
    |> Query.add_filters(filters)
    |> Query.add_must_not(must_not)
    |> Query.add_exists(exists)
    |> Query.build
    |> post_query
    |> Core.Utils.atomize
    |> Mapping.map
  end

  def search_geometries(q, filters, must_not, exists) do
    Query.init(q, @max_geometries)
    |> Query.add_filters(filters)
    |> Query.add_must_not(must_not)
    |> Query.add_exists(exists)
    |> Query.add_exists(@exists_geometries)
    |> Query.only_fields(@fields_geometries)
    |> Query.build
    |> post_query
    |> Core.Utils.atomize
    |> Mapping.map
  end

  defp get_base_url do
    "#{Core.Config.get(:elasticsearch_url)}/#{Core.Config.get(:elasticsearch_index_prefix)}_*"
  end

  defp post_query(query) do
    HTTPoison.post("#{get_base_url()}/_search", query, [{"Content-Type", "application/json"}])
    |> handle_result
  end

  defp handle_result({:ok, %HTTPoison.Response{status_code: 200, body: body}}) do
    Poison.decode! body
  end
  defp handle_result({:ok, %HTTPoison.Response{status_code: 400, body: body}}) do
    Logger.error "Elasticsearch query failed with status 400! Response: #{inspect body}"
    %{error: "bad_request"}
  end
  defp handle_result({:error, %HTTPoison.Error{reason: reason}}) do
    Logger.error "Elasticsearch query failed! Reason: #{inspect reason}"
    %{error: "unknown"}
  end
end
