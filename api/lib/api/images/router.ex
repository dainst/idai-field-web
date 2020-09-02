defmodule Api.Images.Router do

  use Plug.Router
  alias Api.Documents.Index
  import Api.RouterUtils


  plug :match
  plug Api.Documents.ReadableProjectsPlug
  plug :dispatch

  get "/:project/:id" do
    IO.puts "#{project}:#{id}"
    result = Api.Images.CantaloupeAdapter.get(project, id)
    # IO.inspect result
    case result do
      {:ok, %{ body: image_data }} -> conn
                                      |> put_resp_content_type("image/jpeg")
                                      |> put_resp_header("cache-control", "max-age=86400, private, must-revalidate")
                                      |> send_resp(200, image_data)
      {:error, _error} -> nil
    end
  end

  get "/:id" do
    with %{ project: project } <- Index.get(id),
         :ok <- access_for_project_allowed(conn.private[:readable_projects], project),
         {:ok, image_data} <- File.read("#{Core.Config.get(:images_dir)}/#{project}/#{id}")
    do
      conn
      |> put_resp_content_type("image/jpeg")
      |> put_resp_header("cache-control", "max-age=86400, private, must-revalidate")
      |> send_resp(200, image_data)
    else
      nil -> send_not_found(conn)
      :unauthorized_access -> send_unauthorized(conn)
      {:error, reason} -> send_error(conn, "Error when reading file: #{reason |> :file.format_error}")
      _ -> send_error(conn, "Unknown error")
    end
  end
end
