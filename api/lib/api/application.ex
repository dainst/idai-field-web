defmodule Api.Application do

  use Application

  def start(_type, _args) do
    children = [Api.Server]
    opts = [strategy: :one_for_one, name: Api.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
