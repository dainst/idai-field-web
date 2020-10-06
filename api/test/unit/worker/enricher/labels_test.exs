defmodule Worker.Enricher.LabelsTest do
  use ExUnit.Case, async: true
  use Plug.Test
  alias Worker.Enricher.Labels
  alias Core.ProjectConfigLoader

  test "add labels" do

    change = %{
      :doc => %{
        :resource => %{
          :identifier => "ABC",
          :shortDescription => "Test resource",
          :category => "Operation",
          "color" => ["Grün", "Blau"],
          "material" => ["Eisen"],
          "width" => [%{ "inputValue" => 10, "inputUnit" => "cm", "measurementPosition" => "Maximale Ausdehnung" }],
          "period" => %{ "value" => "Old Babylonian", "endValue" => "New Babylonian" },
          :id => "42",
          :relations => %{
            "liesWithin" => [%{
              resource: %{
                :id => "DEF",
                :identifier => "Test resource 2",
                :category => "Operation"
              }
            },
            %{
              resource: %{
                :id => "GHI"
              }, deleted: true
            }]
          }
        }
      }
    }

    start_supervised({ProjectConfigLoader, {"test/resources", ["test-project"]}})
    configuration = ProjectConfigLoader.get("test-project")

    result = Labels.add_labels(change, configuration)

    assert result == %{
      :doc => %{
        :resource => %{
          id: "42",
          identifier: "ABC",
          shortDescription: "Test resource",
          category: %{ name: "Operation", label: %{ de: "Maßnahme", en: "Operation" } },
          color: [
            %{ name: "Grün", label: %{} }, # Value definition found, but does not include label
            %{ name: "Blau", label: %{ de: "Blau", en: "Blue" } } # Value definition with label found
          ],
          material: [
            %{ name: "Eisen", label: %{} } # No value definition found
          ],
          width: [
            %{
              inputValue: 10,
              inputUnit: "cm",
              measurementPosition: %{
               name: "Maximale Ausdehnung",
               label: %{
                 de: "Maximale Ausdehnung",
                 en: "Maximum expansion"
                }
              }
            }
          ],
          period: %{
            value: %{
              name: "Old Babylonian",
              label: %{
                de: "Altbabylonisch",
                en: "Old Babylonian"
              }
            },
            endValue: %{
              name: "New Babylonian",
              label: %{
                de: "Neubabylonisch",
                en: "New Babylonian"
              }
            }
          },
          relations: %{
            liesWithin: [%{
              resource: %{
                :id => "DEF",
                :identifier => "Test resource 2",
                :category => %{ name: "Operation", label: %{ de: "Maßnahme", en: "Operation" } }
              }
            },
              %{
                resource: %{
                  :id => "GHI"
                }, deleted: true
              }]
          }
        }
      }
    }
  end

  test "handle missing label - omit field" do

    change = %{
      :doc => %{
        :resource => %{
          :identifier => "ABC",
          :shortDescription => "Test resource",
          :category => "Operation",
          "non_existing" => ["Grün", "Blau"], # should not exist in result
          :id => "42",
          :relations => %{}
        }
      }
    }

    start_supervised({Core.ProjectConfigLoader, {"test/resources", ["test-project"]}})
    configuration = ProjectConfigLoader.get("test-project")

    result = Labels.add_labels(change, configuration)
    assert result == %{
             doc: %{
               resource: %{
                 category: %{ label: %{ de: "Maßnahme", en: "Operation" }, name: "Operation" },
                 id: "42",
                 identifier: "ABC",
                 relations: %{},
                 shortDescription: "Test resource"
               }
             }
           }
  end
end
