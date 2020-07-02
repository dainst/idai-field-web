
defmodule Core.Layout do

  def get_layout(doc, %{ "groups" => groups }) do

    doc = put_in(doc, [:resource, "groups"], [])

    Enum.reduce(groups, doc,
      fn group, doc ->

        update_in(doc, [:resource, "groups"],
          fn groups -> # TODO extract append function or search for existing alternative
            groups ++ scan_group group, doc
          end
        )
      end
    )
  end

  defp scan_group(%{ "fields" => fields }, _doc) do

    IO.inspect fields

    group = %{
      fields: []
    }
    # TODO add placeholder items for existing fields to fulfill next 2 test expectations

    [group] # if fields is empty return [], otherwise [group]
  end
end
