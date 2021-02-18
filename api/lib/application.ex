defmodule Api.Application do
  require Logger

  use Application

  def start(_type, _args) do

    Logger.info "Starting iDAI.field backend #{inspect Mix.env()}"

    children = [
      Api.Router,
      %{
        id: Api.Core.ProjectConfigLoader,
        start: {
          Api.Core.ProjectConfigLoader,
          :start_link,
          [
            {
              if Mix.env() == :test do "test/resources" else "resources/projects" end,
              Api.Core.Config.get(:projects)
            }
          ]
        }
      },
      Api.Worker.Supervisor
    ]
    opts = [strategy: :one_for_one, name: Api.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
