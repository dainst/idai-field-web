defmodule Api.Auth.Rights do
  alias Api.Auth.Guardian
  alias Api.Core.Config # TODO get rid of dependency

  @anonymous "anonymous"

  def is_admin(user_name) do # TODO move elsewhere
    users = Config.get(:rights).users
    user  = Enum.find(users, %{}, fn user -> user.name == user_name end)
    user[:admin] == true
  end

  def authorize(credentials, _rights = %{ users: users }) do
    case user_by(credentials, users) do
      user = %{ name: @anonymous } -> 
        if credentials[:pass] != nil do
          %{ info: :not_found}
        else
          %{ is_admin: user.admin }
        end
      user = %{ } -> {:ok, token, _claims} = Guardian.encode_and_sign(user)
              %{ token: token, is_admin: user.admin }
      nil -> %{ info: :not_found }
    end
  end

  def authenticate(nil, _rights = %{ readable_projects: readable_projects}) do
    anonymous_user(readable_projects)
  end
  def authenticate(bearer, _rights = %{ readable_projects: readable_projects }) do
    token = String.replace bearer, "Bearer ", ""
    case Guardian.resource_from_token(token) do
      {:ok, token_content, _} -> assemble_user_info(token_content.user_name, readable_projects)
      _ -> anonymous_user(readable_projects) # todo write test
    end
  end

  defp user_by(%{ name: @anonymous }, users) do
    anon? = fn u -> u.name == @anonymous end
    case Enum.filter users, anon? do
      [found_user|_] -> update_admin(found_user)
      [] -> %{ name: @anonymous, admin: false }
    end
  end
  defp user_by(%{ name: name, pass: pass }, users) do
    auth_ok? = fn u -> u.name == name and u.pass == pass end
    case Enum.filter users, auth_ok? do
      [found_user|_] -> update_admin(found_user)
      [] -> nil
    end
  end
  defp user_by(_, _users), do: nil

  defp update_admin(user) do
    if user[:admin] == true do
      user
    else
      put_in(user[:admin], false)
    end
  end

  defp anonymous_user(readable_projects) do
    assemble_user_info(@anonymous, readable_projects)
  end

  defp assemble_user_info(user_name, readable_projects) do
    all_readable_projects = if not is_admin(user_name) do
      user_specific_readable_projects = if user_name != @anonymous, do: get_readable_projects(user_name, readable_projects), else: []
      anonymously_readable_projects = get_readable_projects(@anonymous, readable_projects)
      Enum.uniq(user_specific_readable_projects ++ anonymously_readable_projects)
    else
      Config.get(:projects) # <- TODO this sideways access to config should not be here
    end
    %{ 
      user_name: user_name, 
      readable_projects: all_readable_projects,
      is_admin: is_admin(user_name)
    }
  end

  defp get_readable_projects(user_name, readable_projects) do
    user_name = if is_atom(user_name), do: user_name, else: String.to_atom(user_name)
    readable_projects[user_name]
    || readable_projects[Atom.to_string(user_name)]
    || []
  end
end
