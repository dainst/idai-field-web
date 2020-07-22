defmodule Core.UtilsTest do
  use ExUnit.Case

  test "base case" do
    assert Core.Utils.atomize(%{ "a" => "b" }) == %{ a: "b" }
  end

  test "2 args" do
    assert Core.Utils.atomize(%{ "a" => "b" }, [:a]) == %{ "a" => "b" }
  end

  test "only atomize certain keys, let others untouched" do
    result = Core.Utils.atomize(%{ "a" => "b", "c" => "d" }, [:a], true)
    assert result == %{ :a => "b", "c" => "d" }
    assert result.a == "b"
  end

  test "exclusions" do
    result = Core.Utils.atomize(%{ "a" => "b", "c" => "d" }, [:c])
    assert result == %{ :a => "b", "c" => "d" }
    assert result.a == "b"
  end

  test "exclusions - recursive case" do
    result = Core.Utils.atomize(%{ "a" => %{ "c" => "d", "b" => "m" }}, [:c])
    assert result == %{ :a => %{ "c" => "d", :b => "m" } }
    assert result.a.b == "m"
  end

  test "pass list" do
    result = Core.Utils.atomize([%{ "a" => "d", "b" => "m" }])
    assert result == [%{ :a => "d", :b => "m" }]
  end

  test "pass list, explicit exclusion" do
    result = Core.Utils.atomize([%{ "a" => "d", "b" => "m" }], [:b])
    assert result == [%{ :a => "d", "b" => "m" }]
  end

  test "exclusions - recursive case, with lists" do
    result = Core.Utils.atomize(%{ "a" => [%{ "a" => "d", "b" => "m" }]}, [:b])
    assert result == %{ :a => [%{ :a => "d", "b" => "m" }] }
  end

  test "map contains already atomized key" do
    result = Core.Utils.atomize(%{ a: "b"}, [:a], true)
    assert result == %{ a: "b" }
  end

  test "up to" do
    result = Core.Utils.atomize_up_to(%{ "a" => %{ "b" => "c" }}, :a)
    assert result == %{ a: %{ "b" => "c" } }

    result = Core.Utils.atomize_up_to(%{ "a" => %{ "b" => %{ "c" => "d" } }}, :b)
    assert result == %{ a: %{ b: %{ "c" => "d" }} }

    result = Core.Utils.atomize_up_to(%{ "a" => 3 }, :a)
    assert result == %{ a: 3 }

    result = Core.Utils.atomize_up_to(%{ "a" => 3 }, :b)
    assert result == %{ a: 3 }
  end

  test "up to - with arrays" do
    result = Core.Utils.atomize_up_to([%{ "a" => %{ "b" => "c" }}], :a)
    assert result == [%{ a: %{ "b" => "c" } }]

    result = Core.Utils.atomize_up_to(%{ "a" => [%{ "b" => %{ "c" => "d" } }]}, :b)
    assert result == %{ a: [%{ b: %{ "c" => "d" }}] }

    result = Core.Utils.atomize_up_to(%{ "a" => [3] }, :a)
    assert result == %{ a: [3] }

    result = Core.Utils.atomize_up_to(%{ "a" => [3] }, :b)
    assert result == %{ a: [3] }
  end
end