"""
{
    "resource": {
        "identifier": "F-1",
        "shortDescription": "Schöner Fund",
        "geometry": {},
        "id": "134f-1235-f134g",
        "type": "Find",
        "groups": [
            {
                "name": "position",
                "label": {
                    "de": "Lage / Kontext",
                    "en": "Position / context"
                },
                "relations": [
                    {
                        "name": "isAbove",
                        "label": {
                            "de": "Liegt über",
                            "en": "Above"
                        },
                        "targets": [
                            {
                                "id": "134f-1235-f134g",
                                "identifier": "F-2",
                                "shortDescription": "Schöne Münze",
                                "type": "Coin"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "dimesions",
                "label": {
                    "de": "Maße",
                    "en": "Dimensions"
                }
                "fields": [
                    {
                        "name": "width",
                        "label": {
                            "de": "Breite",
                            "en": "Width"
                        },
                        "value": "1cm"
                    },
                    {
                        "name": "height",
                        "label": {
                            "de": "Höhe",
                            "en": "Height"
                        },
                        "value": "2cm"
                    }
                ]
            }
        ]
    }
}
"""

defmodule Core.Layout do

    def get_layout(doc, project_conf) do
        # TODO
    end

end
