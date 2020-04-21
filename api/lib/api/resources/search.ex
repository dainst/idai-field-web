defmodule Api.Resources.Search do
  import Api.Resources.Helper

  def by(nil, nil), do: by("*", 100)
  def by(nil, size), do: by("*", size)
  def by(q, nil), do: by(q, 100)

  def by(q, size) do
    handle_result HTTPoison.get("#{get_base_url()}/_search", [], params: %{q: q, size: size})
  end

  defp handle_result({:ok, %HTTPoison.Response{status_code: 200, body: body}}) do
    body
    |> to_atomized_result
    |> to_hits
    |> Enum.map(&to_resource/1)
  end

  defp handle_result({:ok, %HTTPoison.Response{status_code: 404}}) do
    []
  end

  defp handle_result({:error, %HTTPoison.Error{reason: reason}}) do
    IO.inspect reason
    []
  end
end