defmodule Worker.Services.TilesCalculator do

  @imageroot "/imageroot/"
  @tile_size 256

#    size = 6000
#    project = "wes"
#    image_id = "6c5f936b-dba9-bf57-b681-5fc292e00e0b"

  def calc_tiles(project, image_id, image_size = {size_x, size_y}) do

    template = create_template(image_size, @tile_size)

    # todo: build all commands, then flatten, then execute them
    commands = Enum.map(template, fn {{rescale, entries}, z} ->
      rescale = floor(rescale)
      {cmd, args} = make_rescale_command(project, rescale, rescale)
      System.cmd(cmd, args)
      Enum.map(entries,
        fn entry ->
           {cmd_a, args_a, cmd_b, args_b} = make_crop_commands(
             project, @tile_size, "#{image_id}.#{rescale}.jpg", image_id, z, entry)
           System.cmd(cmd_a, args_a)
           System.cmd(cmd_b, args_b)
           nil
        end)
    end)
    nil
  end

  defp create_template(image_size = {size_x, size_y}, tile_size) do
    Stream.unfold({:continue, image_size}, fn {run, current_size = {current_size_x, current_size_y}} ->
      if run != :continue do
        nil
      else
        {
          {
            current_size,
            List.flatten(calc_template(current_size, tile_size))
          },
          {
            if current_size_x < tile_size do :halt else :continue end,
            {current_size_x / 2, current_size_y / 2}
          }
        }
      end
    end) |> Enum.to_list() |> Enum.reverse() |> Enum.with_index()
  end

  defp calc_template(current_size, tile_size) do
    fit_times = Integer.floor_div(floor(current_size), tile_size) + if Integer.mod(floor(current_size), tile_size) != 0 do 1 else 0 end
    Enum.reduce(
      0 .. fit_times-1,
      [],
      fn x_val, acc ->
        acc ++ [
          Enum.reduce(
            0 .. fit_times-1,
            [],
            fn y_val, acc ->
              acc ++ [
                %{
                  x_index: x_val,
                  y_index: y_val,
                  x_pos: x_val * tile_size,
                  y_pos: y_val * tile_size
                }
              ]
            end
          )
        ]
      end
    )
  end

  defp make_rescale_command(project, rescale_x, rescale_y) do
    {"convert",
      [
        @imageroot <> project <> "/6c5f936b-dba9-bf57-b681-5fc292e00e0b.jpg",
        "-resize",
        "#{rescale_x}x#{rescale_y}",
        @imageroot <> project <> "/6c5f936b-dba9-bf57-b681-5fc292e00e0b.#{rescale_x}.jpg" # todo rescale_y
      ]
    }
  end

  defp make_crop_commands(
         project,
         tile_size,
         input,
         output,
         z_index,
         %{x_index: x_index, y_index: y_index, x_pos: x_pos, y_pos: y_pos}) do
    {
      "mkdir",
      [
        "-p", @imageroot <> project <> "/#{output}/#{z_index}/#{x_index}"
      ],
      "convert",
      [
        @imageroot <> project <> "/#{input}",
        "-crop", "#{tile_size}x#{tile_size}+#{x_pos}+#{y_pos}",
        "-background", "transparent",
        "-extent", "#{tile_size}x#{tile_size}",
        "/imageroot/wes/#{output}/#{z_index}/#{x_index}/#{y_index}.png"
      ]
    }
  end
end