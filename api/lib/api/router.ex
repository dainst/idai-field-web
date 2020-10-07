defmodule Api.Router do
# todo move this artifact to the top leve (let it be just 'Router')


  use Plug.Router

  plug :match

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Poison
  )

  plug :dispatch

  forward("/api/documents", to: Api.Documents.Router)

  forward("/api/images", to: Api.Images.Router)

  forward("/api/auth", to: Api.Auth.Router)

  forward("/api/worker", to: Worker.Router)

  match _ do
    send_resp(conn, 404, "Requested page not found!")
  end

  def child_spec(opts) do
    %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [opts]}
    }
  end

  def start_link(_opts) do
    Plug.Cowboy.http(__MODULE__, [])
  end
end
